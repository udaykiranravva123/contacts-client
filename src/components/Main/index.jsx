import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import axios from "axios";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		window.location.reload();
	};

	const [data, setData] = useState({
		user: localStorage.getItem("userId"),
		name: "",
		email: "",
		phonenumber: "",
	});

	const [contacts, setContacts] = useState([]);

	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/contact/createContact";
			const { data: res } = await axios.post(url, data);
			if(res.status == true) {
				setData({
					user: localStorage.getItem("userId"),
					name: "",
					email: "",
					phonenumber: "",
				});
				alert("Contact created successfully");
				window.location.reload();
			}
			
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	const getAllContacts = async () => {
		try {
			const url = "http://localhost:8080/api/contact/getContacts";
			const { data: res } = await axios.post(url, data);
			const defaultContacts = []
			for(let i = 0; i < res.length; i++) {
				defaultContacts.push(res[i]);
			}
			setContacts(defaultContacts);	
		} catch (error) {	
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	useEffect(() => {
		getAllContacts();
	}, [])

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Contacts</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
			<div className={styles.right}>
				<form className={styles.form_container} onSubmit={handleSubmit}>
					<h1>Create Contact</h1>
					<input
						type="name"
						placeholder="Name"
						name="name"
						onChange={handleChange}
						value={data.name}
						required
						className={styles.input}
					/>
					<input
						type="email"
						placeholder="Email"
						name="email"
						onChange={handleChange}
						value={data.email}
						required
						className={styles.input}
					/>
					<input
						type="phonenumber"
						placeholder="Phone Number"
						name="phonenumber"
						onChange={handleChange}
						value={data.phonenumber}
						required
						className={styles.input}
					/>
					{error && <div className={styles.error_msg}>{error}</div>}
					<button type="submit" className={styles.green_btn}>
						Save
					</button>
				</form>
			</div>
			<div>
				<h1 style={{
					paddingTop: "30px",
					textAlign: "center",

				}}>My Contacts</h1>
				<div style={{
					paddingLeft: "10%",
					paddingRight: "10%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}>
					<table>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Phone Number</th>
					</tr>
					{contacts.map((contact) => (
							<tbody>
								<tr>
									<td>
										<h5>{contact.name}</h5>
									</td>
									<td>
										<h5>{contact.email}</h5>
									</td>
									<td>
										<h5>{contact.phonenumber}</h5>
									</td>
								</tr>
							</tbody>
					))}
				</table>
			</div>
			</div>
		</div>
	);
};

export default Main;
