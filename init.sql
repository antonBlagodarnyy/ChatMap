CREATE TABLE `users` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE locations (
      id INT NOT NULL,
      latitude DOUBLE NOT NULL,
      longitude DOUBLE NOT NULL,
      PRIMARY KEY (id),
      CONSTRAINT fk_location_user
          FOREIGN KEY (id)
              REFERENCES `users`(id)
              ON DELETE CASCADE
);

CREATE TABLE messages (
     id INT AUTO_INCREMENT PRIMARY KEY,
     sender INT NOT NULL,
     receiver INT NOT NULL,
     text TEXT NOT NULL,
     ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

     CONSTRAINT fk_message_sender
         FOREIGN KEY (sender)
             REFERENCES `users`(id)
             ON DELETE CASCADE,

     CONSTRAINT fk_message_receiver
         FOREIGN KEY (receiver)
             REFERENCES `users`(id)
             ON DELETE CASCADE,

     CONSTRAINT chk_sender_receiver_different
         CHECK (sender <> receiver)
);
