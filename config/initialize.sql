CREATE TABLE IF NOT EXISTS events(
    id INT NOT NULL AUTO_INCREMENT,
    datetime DATETIME,
    detail TEXT,
    format VARCHAR(255),
    file VARCHAR(1024)
);

-- There is a missing patient_document_id here but it isnt in the model
CREATE TABLE IF NOT EXISTS exams(
    id INT NOT NULL AUTO_INCREMENT,
    datetime DATETIME,
    detail TEXT,
    format VARCHAR(16),
    file VARCHAR(1024)
);

CREATE TABLE IF NOT EXISTS notifications(
    id INT NOT NULL AUTO_INCREMENT,
    datetime DATETIME NOT NULL,
    message TEXT NOT NULL,
);

CREATE TABLE IF NOT EXISTS patients(
    id INT NOT NULL AUTO_INCREMENT,
    document_id INT,
    fist_name VARCHAR(128),
    last_name VARCHAR(128),
    age INT,
    gender VARCHAR(16),
    blood_type VARCHAR(4),
    email VARCHAR(320),
    emergency_contact_name VARCHAR(128),
    emergency_contact_phone VARCHAR(128),
);


-- Not sure what this one is
CREATE TABLE IF NOT EXISTS predictions(
    prediction_id INT NOT NULL AUTO_INCREMENT, 
    date_requested DATETIME NOT NULL,
    patient_document_id INT,
    label TEXT,
    FOREIGN KEY (patient_document_id) REFERENCES patients(document_id)
);