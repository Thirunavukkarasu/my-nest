const { withAppBuildGradle, withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Expo config plugin to ensure minSdkVersion is set to 24
 * This fixes the issue where app.json minSdkVersion isn't properly applied during prebuild
 *
 * This plugin modifies both app/build.gradle and project-level build.gradle to ensure
 * minSdkVersion is set correctly, even if expo-build-properties doesn't apply correctly.
 */
const withMinSdkVersion = (config) => {
  // First, modify app/build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let contents = config.modResults.contents;

      // Replace any existing minSdkVersion (handles various formats)
      // Match: minSdkVersion 22, minSdkVersion = 22, minSdkVersion: 22, etc.
      contents = contents.replace(
        /minSdkVersion\s*[=:]?\s*\d+/g,
        "minSdkVersion 24"
      );

      // Also handle minSdk property if it exists
      contents = contents.replace(/minSdk\s*[=:]?\s*\d+/g, "minSdk 24");

      // If minSdkVersion doesn't exist in defaultConfig, add it
      if (!contents.includes("minSdkVersion 24")) {
        // Try to find defaultConfig block and add minSdkVersion
        if (contents.includes("defaultConfig")) {
          // Add minSdkVersion after defaultConfig opening brace
          contents = contents.replace(
            /(defaultConfig\s*\{)/,
            "$1\n        minSdkVersion 24"
          );
        } else if (contents.includes("android")) {
          // If no defaultConfig found, try adding to android block
          contents = contents.replace(
            /(android\s*\{)/,
            "$1\n        minSdkVersion 24"
          );
        }
      }

      config.modResults.contents = contents;
    }
    return config;
  });

  // Also modify project-level build.gradle and gradle.properties if they exist
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const platformRoot = config.modRequest.platformProjectRoot;

      // Modify project-level build.gradle
      const projectBuildGradlePath = path.join(platformRoot, "build.gradle");
      if (fs.existsSync(projectBuildGradlePath)) {
        let contents = fs.readFileSync(projectBuildGradlePath, "utf-8");
        contents = contents.replace(
          /minSdkVersion\s*[=:]?\s*\d+/g,
          "minSdkVersion 24"
        );
        fs.writeFileSync(projectBuildGradlePath, contents);
      }

      // Modify gradle.properties if it exists
      const gradlePropertiesPath = path.join(platformRoot, "gradle.properties");
      if (fs.existsSync(gradlePropertiesPath)) {
        let contents = fs.readFileSync(gradlePropertiesPath, "utf-8");
        // Remove any existing minSdkVersion entries
        contents = contents.replace(/^.*minSdkVersion.*$/gm, "");
        // Add minSdkVersion if not already present
        if (!contents.includes("android.minSdkVersion")) {
          contents += "\nandroid.minSdkVersion=24\n";
        }
        fs.writeFileSync(gradlePropertiesPath, contents);
      }

      return config;
    },
  ]);

  return config;
};

module.exports = withMinSdkVersion;
