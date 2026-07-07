-- Create Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    college_name VARCHAR(255),
    grade VARCHAR(10),
    duration VARCHAR(100),
    pdf_url VARCHAR(512),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    user_email VARCHAR(255),
    course_title VARCHAR(255),
    issued_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read-only access by certificate number (or id)
CREATE POLICY "Allow public read access for certificates"
ON certificates
FOR SELECT
TO public
USING (true);

-- Optional: trigger to automatically generate certificate_number in the format NLIT-YYYY-XXXX
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
DECLARE
    seq_num INT;
    year_val TEXT;
BEGIN
    year_val := TO_CHAR(NOW(), 'YYYY');
    IF NEW.certificate_number IS NULL THEN
        SELECT COALESCE(MAX(SUBSTRING(certificate_number FROM 11)::INT), 1000) + 1
        INTO seq_num
        FROM certificates
        WHERE certificate_number LIKE 'NLIT-' || year_val || '-%';
        
        NEW.certificate_number := 'NLIT-' || year_val || '-' || seq_num;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER before_insert_certificates
BEFORE INSERT ON certificates
FOR EACH ROW
EXECUTE FUNCTION generate_certificate_number();
