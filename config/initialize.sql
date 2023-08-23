CREATE TABLE IF NOT EXISTS events(
    id INT NOT NULL AUTO_INCREMENT,
    date DATETIME,
    detail TEXT,
    format VARCHAR(255),
    file VARCHAR(1024)
);

-- There is a missing patient_document_id here but it isnt in the model
CREATE TABLE IF NOT EXISTS exams(
    id INT NOT NULL AUTO_INCREMENT,
    date DATE,
    detail TEXT,
    format VARCHAR(255),
    file VARCHAR(1024)
);

CREATE TABLE IF NOT EXISTS notifications(
    id VARCHAR(20) PRIMARY KEY,
    datetime DATETIME NOT NULL,
    message TEXT NOT NULL
);

-- Not sure what this one is
CREATE TABLE IF NOT EXISTS predictions(
    prediction_id VARCHAR(20) PRIMARY KEY,
    date_requested DATETIME NOT NULL,
    patient_document_id, VARCHAR(32),
    label TEXT
);