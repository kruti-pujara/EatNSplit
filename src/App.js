import { useState } from "react";

const initialFriends = [
	{
		id: 118836,
		name: "Clark",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Sarah",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Anthony",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleAddFriends(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	}

	function handleShowAddFriend() {
		setShowAddFriend((show) => !show);
	}

	function handleSelection(friend) {
		setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
		setShowAddFriend(false);
	}

	function handleSplitBill(value) {
		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend
			)
		);
		setSelectedFriend(null);
	}
	return (
		<div className='app'>
			<div className='sidebar'>
				<FriendsList
					friends={friends}
					onSelection={handleSelection}
					selectedFriend={selectedFriend}
				/>
				{showAddFriend && <FormAddFreiend onAddFriend={handleAddFriends} />}
				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? "close" : "Add friend"}
				</Button>
			</div>
			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onSplitBill={handleSplitBill}
				/>
			)}
		</div>
	);
}

function FriendsList({ friends, onSelection, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelection={onSelection}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, onSelection, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;
	return (
		<li className={isSelected ? "selected" : ""}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}
			{friend.balance < 0 && (
				<p className='red'>
					you owe {friend.name} ₹{Math.abs(friend.balance)}
				</p>
			)}
			{friend.balance > 0 && (
				<p className='green'>
					{friend.name} owes you ₹{Math.abs(friend.balance)}
				</p>
			)}
			<Button onClick={() => onSelection(friend)}>
				{isSelected ? "close" : "Select"}
			</Button>
		</li>
	);
}

function Button({ children, onClick }) {
	return (
		<button className='button' onClick={onClick}>
			{children}
		</button>
	);
}

function FormAddFreiend({ onAddFriend }) {
	const [name, setName] = useState("");
	const [img, setImg] = useState("https://i.pravatar.cc/48");
	function handleSubmit(e) {
		e.preventDefault();
		if (!name || !img) return;
		const id = crypto.randomUUID();
		const newFriend = {
			id,
			name,
			image: `${img}?=${id}`,
			balance: 0,
		};
		onAddFriend(newFriend);
		setName("");
		setImg("https://i.pravatar.cc/48");
	}

	return (
		<form className='form-add-friend' onSubmit={handleSubmit}>
			<label>👫Friend Name</label>
			<input
				type='text'
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			<label>🌄 Image URL</label>
			<input type='text' value={img} onChange={(e) => setImg(e.target.value)} />

			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [billValue, setBillValue] = useState("");
	const [paidByUser, setPaidByUser] = useState("");
	const paidByFriend = billValue ? billValue - paidByUser : "";
	const [whoIsPaying, setWhoIsPaying] = useState("user");
	function handleSubmit(e) {
		e.preventDefault();

		if (!billValue || !paidByUser) return;

		onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
	}
	return (
		<form className='form-split-bill' onSubmit={handleSubmit}>
			<h2>Split a bill with {selectedFriend.name}</h2>

			<label>💰 Bill value</label>
			<input
				type='text'
				value={billValue}
				onChange={(e) => setBillValue(Number(e.target.value))}
			/>

			<label>🧍‍♀️ Your expense</label>
			<input
				type='text'
				value={paidByUser}
				onChange={(e) =>
					setPaidByUser(
						Number(e.target.value) > billValue
							? paidByUser
							: Number(e.target.value)
					)
				}
			/>

			<label>👫 {selectedFriend.name}'s Expense</label>
			<input type='text' disabled value={paidByFriend} />

			<label>🤑 who is paying the bill? </label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}>
				<option value='user'>You</option>
				<option value='friend'>{selectedFriend.name}</option>
			</select>

			<Button>Split bill</Button>
		</form>
	);
}
export default App;
