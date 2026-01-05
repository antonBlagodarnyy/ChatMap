# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean test

RUN mvn clean package

# Package stage
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the **Spring Boot repackaged JAR** explicitly
COPY --from=build /app/target/Api-1.1.0-SNAPSHOT.jar app.jar


ENTRYPOINT ["java","-jar","app.jar"]
EXPOSE 8080