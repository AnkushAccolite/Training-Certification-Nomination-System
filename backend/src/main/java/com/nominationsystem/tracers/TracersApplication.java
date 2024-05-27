package com.nominationsystem.tracers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class TracersApplication {

	public static void main(String[] args) {

		SpringApplication.run(TracersApplication.class, args);
	}

}
