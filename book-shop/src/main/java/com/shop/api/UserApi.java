package com.shop.api;

import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

import com.shop.dto.*;
import com.shop.entitty.model.Voucher;
import com.shop.utils.Common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;

import com.shop.entitty.model.AppRole;
import com.shop.entitty.model.Cart;
import com.shop.entitty.model.User;
import com.shop.common.JwtUtils;
import com.shop.repository.UserRepository;
import com.shop.service.SendMailService;
import com.shop.service.implement.UserDetailsImpl;
import com.shop.repository.CartRepository;
import com.shop.repository.AppRoleRepository;

import static com.shop.common.Constant.FORMAT_DATE;
import static com.shop.utils.Common.convertDateFormat;

@CrossOrigin("*")
@RestController
@RequestMapping("api/auth")
public class UserApi {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	CartRepository cartRepository;

	@Autowired
	AppRoleRepository roleRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	JwtUtils jwtUtils;
	
	@Autowired
	SendMailService sendMailService;
	
	@GetMapping
	public ResponseEntity<List<?>> getAll() {

		List<User> userList = userRepository.findAll();
		List<UserResponse> responseList = new ArrayList<>();
		for (User item : userList){
			if(item != null){
				UserResponse response = new UserResponse();
				response.setUserResponse(item);
				responseList.add(response);
			}
		}
		return ResponseEntity.ok(responseList);
	}

	@GetMapping("{id}")
	public ResponseEntity<?> getOne(@PathVariable("id") Long id) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		User user = userRepository.findById(id).get();
		UserResponse userResponse = new UserResponse();
		userResponse.setUserResponse(user);
		return ResponseEntity.ok(userResponse);
	}

	@GetMapping("email/{email}")
	public ResponseEntity<User> getOneByEmail(@PathVariable("email") String email) {
		if (userRepository.existsByEmail(email)) {
			return ResponseEntity.ok(userRepository.findByEmail(email).get());
		}
		return ResponseEntity.notFound().build();
	}

	@PostMapping
	public ResponseEntity<User> post(@RequestBody User user) {
		if (userRepository.existsByEmail(user.getEmail())) {
			return ResponseEntity.notFound().build();
		}
		if (userRepository.existsById(user.getUserId())) {
			return ResponseEntity.badRequest().build();
		}

		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(1, null));

		user.setRoles(roles);
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setToken(jwtUtils.doGenerateToken(user.getEmail()));
		User u = userRepository.save(user);
		Cart c = new Cart(0L, 0.0, u.getAddress(), u.getPhone(), u);
		cartRepository.save(c);
		return ResponseEntity.ok(u);
	}

	@PutMapping("{id}")
	public ResponseEntity<User> put(@PathVariable("id") Long id, @RequestBody UserDTO userDTO) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		if (!id.equals(userDTO.getUserId())) {
			return ResponseEntity.badRequest().build();
		}
		
		User updateUser = userRepository.findById(id).get();
		if(!userDTO.getPassword().equals(updateUser.getPassword())) {
			updateUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
		}
		Date birthDate = null;
		try {
			birthDate = FORMAT_DATE.parse(convertDateFormat(userDTO.getBirthday()));
			System.out.println("Ngày đã chuyển đổi thành công: " + birthDate);
		} catch (ParseException e) {
			System.out.println("Không thể chuyển đổi chuỗi thành ngày. Đảm bảo chuỗi có cùng định dạng với dateFormat.");
			e.printStackTrace();
		}
		updateUser.setBirthday(birthDate);
		updateUser.setName(userDTO.getName());
		updateUser.setAddress(userDTO.getAddress());
		updateUser.setGender(userDTO.getGender());
		// create new user account
		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(1, null));

		updateUser.setRoles(roles);
		return ResponseEntity.ok(userRepository.save(updateUser));
	}

	@PutMapping("admin/{id}")
	public ResponseEntity<User> putAdmin(@PathVariable("id") Long id, @RequestBody User user) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		if (!id.equals(user.getUserId())) {
			return ResponseEntity.badRequest().build();
		}
		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(2, null));

		user.setRoles(roles);
		return ResponseEntity.ok(userRepository.save(user));
	}

	@DeleteMapping("{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		User u = userRepository.findById(id).get();
		u.setStatus(false);
		userRepository.save(u);
//		repo.deleteById(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Validated @RequestBody LoginRequest loginRequest) {
		Optional<User> u = userRepository.findByEmail(loginRequest.getEmail());
		if(u.isPresent()) {
			User user = u.get();
			if(!user.getStatus()) {
				return ResponseEntity.badRequest().build();
			}
		}
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getName(),
				userDetails.getEmail(), userDetails.getPassword(), userDetails.getPhone(), userDetails.getAddress(),
				userDetails.getGender(), userDetails.getStatus(), userDetails.getImage(), userDetails.getRegisterDate(),
				roles));

	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Validated @RequestBody SignupRequest signupRequest) {

		if (userRepository.existsByEmail(signupRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
		}

		if (userRepository.existsByEmail(signupRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is alreadv in use!"));
		}

		Date birthDate = Common.convertStringToDate(signupRequest.getBirthday());
		User user = new User(signupRequest.getName(), signupRequest.getEmail(),
				passwordEncoder.encode(signupRequest.getPassword()), signupRequest.getPhone(),
				signupRequest.getAddress(), signupRequest.getGender(), signupRequest.getStatus(),
				signupRequest.getImage(), signupRequest.getRegisterDate(),
				birthDate, jwtUtils.doGenerateToken(signupRequest.getEmail()));
		Set<AppRole> roles = new HashSet<>();
		roles.add(new AppRole(1, null));

		user.setRoles(roles);
		userRepository.save(user);
		Cart c = new Cart(0L, 0.0, user.getAddress(), user.getPhone(), user);
		cartRepository.save(c);
		return ResponseEntity.ok(new MessageResponse("Đăng kí thành công"));
	}
	
	@GetMapping("/logout")
	public ResponseEntity<Void> logout() {
		return ResponseEntity.ok().build();
	}
	
	@PostMapping("send-mail-forgot-password-token")
	public ResponseEntity<String> sendToken(@RequestBody String email) {
		
		if (!userRepository.existsByEmail(email)) {
			return ResponseEntity.notFound().build();
		}
		User user = userRepository.findByEmail(email).get();
		String token = user.getToken();
		sendMaiToken(email,token, "Reset mật khẩu");
		return ResponseEntity.ok().build();		
		
	}
	
	public void sendMaiToken(String email, String token, String title) {
		String body = "\r\n"
				+ "    <h2>Hãy nhấp vào link để thay đổi mật khẩu của bạn</h2>\r\n"
				+ "    <a href=\"http://localhost:8989/forgot-password/"+token+"\">Đổi mật khẩu</a>";
		sendMailService.queue(email, title, body);
	}
}
