# Import Flats from CSV

This script imports flat and resident data from a CSV file into the database via the API.

## Usage

### Basic Usage (with default credentials)

```bash
# From the project root
bun run scripts/import-flats-from-csv.ts

# Or from the scripts directory
cd scripts
bun import-flats-from-csv.ts
```

### With Custom Options

```bash
# Specify CSV file path
bun run scripts/import-flats-from-csv.ts --csv=./path/to/data.csv

# Specify API URL
bun run scripts/import-flats-from-csv.ts --api-url=https://my-nest-api22.vercel.app

# Use existing authentication token
bun run scripts/import-flats-from-csv.ts --token=your-jwt-token-here

# Custom login credentials
bun run scripts/import-flats-from-csv.ts --email=admin@example.com --password=yourpassword

# Combine options
bun run scripts/import-flats-from-csv.ts \
  --api-url=https://my-nest-api22.vercel.app \
  --csv=./scripts/rr_enclave_data.csv \
  --email=test@gmail.com \
  --password=changeme
```

### Environment Variables

You can also set these as environment variables:

```bash
export API_URL=https://my-nest-api22.vercel.app
export API_TOKEN=your-jwt-token
export API_EMAIL=test@gmail.com
export API_PASSWORD=changeme

bun run scripts/import-flats-from-csv.ts
```

## CSV Format

The script expects a CSV file with the following columns:

- `flat_number` - Unique flat identifier (e.g., "G001", "F101")
- `floor` - Floor number (integer)
- `owner_name` - Full name of the owner (will be split into firstName and lastName)
- `maintenance_amount` - Monthly maintenance charge
- `user_type` - Type of user (typically "owner")
- `status` - Flat status (e.g., "occupied", "vacant")
- `email_address` - Owner email (optional, can be empty)
- `contact_number` - Owner phone number (optional, can be empty)

## What It Does

1. **Authenticates** with the API (logs in if no token provided)
2. **Reads** the CSV file
3. **Parses** each row and converts it to the API format
4. **Creates** flats with owners using the `/api/flats/mutate` endpoint
5. **Reports** success/failure for each entry

## Example Output

```
📋 Importing flats from CSV...
API URL: http://localhost:3000
CSV Path: /path/to/rr_enclave_data.csv
🔐 Logging in to get authentication token...
✅ Login successful
📊 Found 47 rows in CSV

[1/47] Creating flat G001...
  Owner: ARUN KUMAR S
  ✅ Success

[2/47] Creating flat G002...
  Owner: N.MADHUSUDHAN REDDY
  ✅ Success

...

==================================================
📊 Import Summary
==================================================
✅ Successfully created: 47
❌ Failed: 0
==================================================
```

## Notes

- The script automatically splits owner names into firstName and lastName (last word becomes lastName)
- Empty email and phone fields are handled gracefully (set to null)
- The script includes a small delay between requests to avoid overwhelming the API
- If a flat already exists (duplicate flat_number), it will be reported as an error
- Authentication token is obtained automatically if not provided

## Troubleshooting

### Login Failed
- Check that the API URL is correct
- Verify the email and password are correct
- Ensure the API server is running

### CSV Parse Errors
- Verify the CSV file exists at the specified path
- Check that the CSV has the correct column headers
- Ensure the CSV is properly formatted (no encoding issues)

### API Errors
- Check that the API server is running and accessible
- Verify the authentication token is valid (if using --token)
- Check API logs for detailed error messages

