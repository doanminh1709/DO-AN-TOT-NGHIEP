package com.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.entitty.model.Order;
import com.shop.entitty.model.User;

public interface OrderRepository extends JpaRepository<Order, Long>{
	List<Order> findByUser(User user);
	List<Order> findByUserOrderByOrdersIdDesc(User user);
	List<Order> findAllByOrderByOrdersIdDesc();
	List<Order> findByStatus(int status);
}
