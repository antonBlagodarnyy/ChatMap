# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env \
    export $(grep -v '^#' /etc/secrets/.env | xargs) && \
    echo "Building app with DB $DB_URL and API_KEY $API_KEY" && \
    mvn clean package

# Package stage
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the **Spring Boot repackaged JAR** explicitly
COPY --from=build /app/target/Message-0.0.1-SNAPSHOT.jar app.jar

# Optional: verify
RUN ls -l /app

ENTRYPOINT ["java","-jar","app.jar"]
EXPOSE 8083