-- Create Flats table
CREATE TABLE Flats (
    flat_id SERIAL PRIMARY KEY,
    flat_number VARCHAR(10) NOT NULL UNIQUE, -- Ensures flat numbers are unique
    floor_number INT NOT NULL,
    bedrooms INT DEFAULT 1,
    bathrooms INT DEFAULT 1,
    total_area DECIMAL(8, 2) DEFAULT 1200.00,
    balcony BOOLEAN DEFAULT FALSE,
    status VARCHAR(10) CHECK (status IN ('Occupied', 'Vacant', 'Maintenance')) DEFAULT 'Vacant',
    monthly_rent DECIMAL(10, 2) DEFAULT 0,
    monthly_maintenance_charge DECIMAL(10, 2) DEFAULT 2000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);

-- Create Residents table
CREATE TABLE Residents (
    resident_id SERIAL PRIMARY KEY, -- Use SERIAL for auto-incrementing in PostgreSQL
    flat_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    lease_start_date DATE NOT NULL,
    lease_end_date DATE,
    is_primary_tenant BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flat_id) REFERENCES Flats(flat_id) ON DELETE CASCADE
);


-- Create Payments table
CREATE TABLE Payments (
    payment_id SERIAL PRIMARY KEY,           -- Unique ID for each payment record
    flat_id INT NOT NULL,                    -- References the flat associated with the payment
    payment_type VARCHAR(20) CHECK (payment_type IN ('Maintenance', 'Rent', 'Utilities', 'Other')) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,          -- Amount of the payment
    payment_date DATE NOT NULL,              -- Date the payment was made
    due_date DATE,                           -- Due date for the payment, if applicable
    status VARCHAR(20) CHECK (status IN ('Paid', 'Pending', 'Overdue')) DEFAULT 'Pending', 
    payment_method VARCHAR(50),              -- Payment method, e.g., 'Bank Transfer', 'Credit Card'
    reference_number VARCHAR(100),           -- Reference number for tracking the transaction
    notes TEXT,                              -- Additional notes or remarks about the payment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flat_id) REFERENCES Flats(flat_id) ON DELETE CASCADE
);


select *from flats left join residents on flats.flat_id = residents.flat_id;