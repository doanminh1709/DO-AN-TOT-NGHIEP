package com.shop.service.implement;

import com.shop.entitty.model.User;
import com.shop.repository.UserRepository;
import com.shop.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImpUserService implements IUserService {


    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> searchCustomerBirthdayToday() {
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        String realtime = currentTime.toString().substring(5 , 10);

        List<User> customers = new ArrayList<>();
        for (User item : userRepository.findAll()) {
            if (item.getBirthday() != null) {
                String birthdayCustomer = item.getBirthday().toString().substring(5, 10);
                if (realtime.equals(birthdayCustomer))
                    customers.add(item);
            }
        }
        return customers;
    }
}
