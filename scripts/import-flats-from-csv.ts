// Type declarations for runtime environment detection
declare const Bun: {
    file(path: string): { text(): Promise<string> };
    exit(code: number): never;
} | undefined;

declare const process: {
    argv: string[];
    env: {
        API_URL?: string;
        API_TOKEN?: string;
        API_EMAIL?: string;
        API_PASSWORD?: string;
        [key: string]: string | undefined;
    };
    cwd(): string;
    exit(code: number): never;
} | undefined;

// Type declaration for require (Node.js)
declare function require(module: string): any;

interface CSVRow {
    flat_number: string;
    floor: string;
    owner_name: string;
    maintenance_amount: string;
    user_type: string;
    status: string;
    email_address: string;
    contact_number: string;
}

interface FlatData {
    flatNumber: string;
    floorNumber: number;
    status: string;
    monthlyMaintenanceCharge: string;
    owner: {
        firstName: string;
        lastName: string;
        email?: string | null;
        phone?: string | null;
    };
}

// Parse CSV file
async function parseCSV(filePath: string): Promise<CSVRow[]> {
    // Use Bun's file API if available, otherwise fallback to Node's fs
    let content: string;
    if (typeof Bun !== 'undefined' && Bun) {
        const file = Bun.file(filePath);
        content = await file.text();
    } else {
        // Node.js fallback
        try {
            // @ts-ignore - require is available at runtime in Node.js
            const fs = require('fs');
            content = fs.readFileSync(filePath, 'utf-8');
        } catch (err) {
            throw new Error(`Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const rows: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row: any = {};
            headers.forEach((header, index) => {
                row[header] = values[index]?.trim() || '';
            });
            rows.push(row as CSVRow);
        }
    }
    return rows;
}

// Parse CSV line handling commas within quoted fields
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

// Split owner name into firstName and lastName
function splitOwnerName(ownerName: string): { firstName: string; lastName: string } {
    const parts = ownerName.trim().split(/\s+/);
    if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' };
    }
    // Last part is lastName, rest is firstName
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(' ');
    return { firstName, lastName };
}

// Convert CSV row to API payload
function convertToFlatData(row: CSVRow): FlatData {
    const { firstName, lastName } = splitOwnerName(row.owner_name);

    return {
        flatNumber: row.flat_number,
        floorNumber: parseInt(row.floor, 10),
        status: row.status.toLowerCase() || 'occupied',
        monthlyMaintenanceCharge: row.maintenance_amount || '2000',
        owner: {
            firstName: firstName || 'Unknown',
            lastName: lastName || 'Owner',
            email: row.email_address?.trim() || null,
            phone: row.contact_number?.trim() || null,
        },
    };
}

// Create flat via API
async function createFlat(apiUrl: string, token: string, flatData: FlatData): Promise<any> {
    const response = await fetch(`${apiUrl}/api/flats/mutate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(flatData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Failed to create flat ${flatData.flatNumber}: ${response.status} - ${JSON.stringify(error)}`);
    }

    return response.json();
}

// Login to get token
async function login(apiUrl: string, email: string, password: string): Promise<string> {
    const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Login failed: ${response.status} - ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.token || data.data?.token;
}

// Helper function to safely exit
function safeExit(code: number): never {
    // Bun has process available, so we can use process.exit
    if (typeof process !== 'undefined' && process && typeof process.exit === 'function') {
        process.exit(code);
    }
    // Fallback if process is not available (shouldn't happen in Bun or Node)
    throw new Error(`Cannot exit: code ${code}`);
}

// Helper function to get process.argv
function getProcessArgs(): string[] {
    if (typeof process !== 'undefined' && process && process.argv) {
        return process.argv.slice(2);
    }
    return [];
}

// Helper function to get process.env
function getProcessEnv(): Record<string, string | undefined> {
    if (typeof process !== 'undefined' && process && process.env) {
        return process.env;
    }
    return {};
}

// Helper function to get current working directory
function getCwd(): string {
    if (typeof process !== 'undefined' && process && typeof process.cwd === 'function') {
        return process.cwd();
    }
    return '.';
}

// Main function
async function main() {
    const args = getProcessArgs();
    const env = getProcessEnv();

    // Parse arguments
    const apiUrl = args.find(arg => arg.startsWith('--api-url='))?.split('=')[1] ||
        env.API_URL ||
        'http://localhost:3000';

    // Resolve CSV path - works with both Bun and Node
    let defaultCsvPath: string;
    if (typeof import.meta !== 'undefined' && (import.meta as any).dir) {
        defaultCsvPath = `${(import.meta as any).dir}/rr_enclave_data.csv`;
    } else {
        defaultCsvPath = `${getCwd()}/scripts/rr_enclave_data.csv`;
    }

    const csvPath = args.find(arg => arg.startsWith('--csv='))?.split('=')[1] ||
        args[0] ||
        defaultCsvPath;

    const token = args.find(arg => arg.startsWith('--token='))?.split('=')[1] ||
        env.API_TOKEN;

    const email = args.find(arg => arg.startsWith('--email='))?.split('=')[1] ||
        env.API_EMAIL ||
        'thirunavukkarasu.sam@gmail.com';

    const password = args.find(arg => arg.startsWith('--password='))?.split('=')[1] ||
        env.API_PASSWORD ||
        'changeme';

    console.log('📋 Importing flats from CSV...');
    console.log(`API URL: ${apiUrl}`);
    console.log(`CSV Path: ${csvPath}`);

    // Get authentication token
    let authToken = token;
    if (!authToken) {
        console.log('🔐 Logging in to get authentication token...');
        try {
            authToken = await login(apiUrl, email, password);
            console.log('✅ Login successful');
        } catch (error: any) {
            console.error('❌ Login failed:', error.message);
            safeExit(1);
        }
    }

    // Parse CSV
    let rows: CSVRow[] = [];
    try {
        rows = await parseCSV(csvPath);
        console.log(`📊 Found ${rows.length} rows in CSV`);
    } catch (error: any) {
        console.error('❌ Failed to parse CSV:', error.message);
        safeExit(1);
    }

    // Process each row
    const results = {
        success: 0,
        failed: 0,
        errors: [] as Array<{ flatNumber: string; error: string }>,
    };

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
            const flatData = convertToFlatData(row);
            console.log(`\n[${i + 1}/${rows.length}] Creating flat ${flatData.flatNumber}...`);
            console.log(`  Owner: ${flatData.owner.firstName} ${flatData.owner.lastName}`);

            await createFlat(apiUrl, authToken!, flatData);
            results.success++;
            console.log(`  ✅ Success`);
        } catch (error: any) {
            results.failed++;
            const errorMsg = error.message || 'Unknown error';
            results.errors.push({ flatNumber: row.flat_number, error: errorMsg });
            console.log(`  ❌ Failed: ${errorMsg}`);
        }

        // Small delay to avoid overwhelming the API
        if (i < rows.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Import Summary');
    console.log('='.repeat(50));
    console.log(`✅ Successfully created: ${results.success}`);
    console.log(`❌ Failed: ${results.failed}`);

    if (results.errors.length > 0) {
        console.log('\n❌ Errors:');
        results.errors.forEach(({ flatNumber, error }) => {
            console.log(`  - ${flatNumber}: ${error}`);
        });
    }

    console.log('='.repeat(50));
}

// Run the script
main().catch(error => {
    console.error('❌ Fatal error:', error);
    safeExit(1);
});

