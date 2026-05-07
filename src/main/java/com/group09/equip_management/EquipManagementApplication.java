package com.group09.equip_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Scanner;
import java.util.Properties;

@SpringBootApplication
public class EquipManagementApplication {

	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);

        // Yeu cau nhap thong tin tu ban phim
        System.out.print("=== MySQL Configuration ===\n");
        System.out.print("Enter MySQL Username: ");
        String dbUser = scanner.nextLine();

        System.out.print("Enter MySQL Password: ");
        String dbPass = scanner.nextLine();

        // Thiet lap thong tin vao System Properties truoc khi Spring Boot khoi chay
        Properties props = System.getProperties();
        props.put("spring.datasource.username", dbUser);
        props.put("spring.datasource.password", dbPass);

		// Dong scanner sau khi su dung
		scanner.close();

		SpringApplication.run(EquipManagementApplication.class, args);
	}

}
