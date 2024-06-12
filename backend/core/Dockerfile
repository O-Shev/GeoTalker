# Use Maven image to build the application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/core-0.0.1-SNAPSHOT.jar core.jar

# Expose port 8080
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "core.jar"]