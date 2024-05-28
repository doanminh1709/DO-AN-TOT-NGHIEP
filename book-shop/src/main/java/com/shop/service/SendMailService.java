package com.shop.service;

import java.io.IOException;

import javax.mail.MessagingException;

import com.shop.entitty.MailInfo;

public interface SendMailService {
	void run();

	void queue(String to, String subject, String body);

	void queue(MailInfo mail);

	void send(MailInfo mail) throws MessagingException, IOException;

	void sendGreeting(String subject , String content , String email , String name , Boolean isHtmlFormat) throws MessagingException;

}
