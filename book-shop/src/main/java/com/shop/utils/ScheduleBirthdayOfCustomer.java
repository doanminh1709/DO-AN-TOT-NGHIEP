package com.shop.utils;

import com.shop.entitty.model.User;
import com.shop.service.implement.ImpUserService;
import com.shop.service.implement.SendMailServiceImplement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import java.util.List;

@Component
public class ScheduleBirthdayOfCustomer {
    @Autowired
    private ImpUserService userService;

    @Autowired
    private SendMailServiceImplement mailService    ;

    @Autowired
    private SpringTemplateEngine templateEngine;

    private final Logger log = LoggerFactory.getLogger(ScheduleBirthdayOfCustomer.class);

    //<second><minute> <hour> <day-of-month> <month> <day-of-week><year> <command>
    @Scheduled(cron = "0 0 18-19 * * ?")
    public void sentGreetingsToCustomer() {

        List<User> userList = userService.searchCustomerBirthdayToday();
        if (!userList.isEmpty()) {
            userList.forEach(item -> {
                Context context = new Context();
                context.setVariable("name", item.getName());
                String html = templateEngine.process("birthday.html", context);
                try {
                    mailService.sendGreeting("Happy Birthday To You", html, item.getEmail(), item.getName(), true);
                } catch (MessagingException ignored) {
                    log.error(ignored.getMessage());
                }
            });
        }
    }
}
