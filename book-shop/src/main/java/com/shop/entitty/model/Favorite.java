package com.shop.entitty.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.shop.entitty.base.AbstractAuditingEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("serial")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "favorites")
public class Favorite extends AbstractAuditingEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long favoriteId;

	@ManyToOne()
	@JoinColumn(name = "userId")
	private User user;
	
	@ManyToOne()
	@JoinColumn(name = "productId")
	private Product product;
	
}
