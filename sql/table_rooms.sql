CREATE TABLE rooms (
        id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255)   NOT NULL,
        last_updated TIMESTAMP,
        n_users SMALLINT UNSIGNED,
        PRIMARY KEY (id)
);
