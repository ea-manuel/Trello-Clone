package com.taskhive.taskhive_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TaskhiveBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskhiveBackendApplication.class, args);
	}

}
