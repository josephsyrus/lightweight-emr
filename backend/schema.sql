CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE clinics (
  clinic_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_name VARCHAR(255) NOT NULL,
  address TEXT,
  contact_number VARCHAR(50)
);

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(clinic_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('Admin','Doctor','Receptionist','LabTech','Nurse')),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE patients (
  patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(clinic_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INT,
  gender VARCHAR(50),
  phone VARCHAR(50) NOT NULL,
  address TEXT,
  UNIQUE(clinic_id, phone)
);

CREATE INDEX idx_patients_phone ON patients(phone);

CREATE TABLE visits (
  visit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(clinic_id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id),
  visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  symptoms TEXT,
  diagnosis TEXT,
  status VARCHAR(50) CHECK (status IN (
    'Visit Opened','In Consultation','Awaiting Lab Results','Diagnosed','Prescribed','Completed'
  ))
);

CREATE TABLE prescriptions (
  prescription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(clinic_id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(visit_id) ON DELETE CASCADE,
  medication VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  duration VARCHAR(100)
);

CREATE TABLE labreport (
  report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(clinic_id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(visit_id) ON DELETE CASCADE,
  test_name VARCHAR(255) NOT NULL,
  result TEXT
);

CREATE TABLE auditlog (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(clinic_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);