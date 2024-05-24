CREATE DATABASE bitespeed;
USE bitespeed;

CREATE TABLE Contact (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    linkedId INT,
    linkPrecedence ENUM('primary', 'secondary') NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME,
    FOREIGN KEY (linkedId) REFERENCES Contact(id)
);


