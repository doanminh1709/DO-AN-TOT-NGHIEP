package com.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.entitty.model.Cart;
import com.shop.entitty.model.User;

public interface CartRepository extends JpaRepository<Cart, Long>{
	Cart findByUser(User user);
}
