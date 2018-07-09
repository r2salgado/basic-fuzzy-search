import React, { Component } from "react";
import { transactions } from "./transactions";
import _ from "lodash";

const divStyle = {
	display: "flex",
	justifyContent: "space-between"
};

const spanStyle = {
	flexBasis: "33%"
};

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			wordToSearch: "",
			transactions: []
		};
		this._onChangeInput = this._onChangeInput.bind(this);
		this.applyFuzzyLogic = this.applyFuzzyLogic.bind(this);
		this.getDateObject = this.getDateObject.bind(this);
		this.dateSortAsc = this.dateSortAsc.bind(this);
	}
	_onChangeInput(evt) {
		this.setState(
			{ wordToSearch: evt.target.value },
			this.applyFuzzyLogic(evt.target.value)
		);
	}
	dateSortAsc(obj1, obj2) {
		if (obj1.dateObject > obj2.dateObject) return -1;
		if (obj1.dateObject < obj2.dateObject) return 1;
		return 0;
	}
	getDateObject(stringValueDate) {
		var st = stringValueDate;
		var pattern = /(\d{2})\-(\d{2})\-(\d{4})T(\d{1,2})\:(\d{2})/;
		return new Date(st.replace(pattern, "$2-$1-$3 $4:$5"));
	}
	applyFuzzyLogic(userInputValue) {
		let source = transactions;
		let points = 0;
		let filteredTransactions = [];

		if (userInputValue) {
			for (let i = 0; i < source.length; i++) {
				//console.log("  --search into: ", source[i]);

				transactions[i].match = false;
				transactions[i].weighing = 0;
				transactions[i].dateObject = this.getDateObject(
					transactions[i].date
				);

				let arrWordToSearch = Array.from(userInputValue);

				let transactionString =
					source[i].amount +
					" " +
					source[i].date +
					" " +
					source[i].card_last_four;

				let arrName = Array.from(transactionString);

				points = 0;
				for (let j = 0; j < arrWordToSearch.length; j++) {
					for (let k = 0; k < arrName.length; k++) {
						if (arrName[k] === arrWordToSearch[j]) {
							k === 0 ? (points += 1) : (points += k);
							transactions[i].match = true;
						}
					}
				}

				transactions[i].weighing = points;
				//console.log("    -Total points: " + points);
			}
			filteredTransactions = transactions;
		} else {
			filteredTransactions = [];
		}

		this.setState({
			transactions: filteredTransactions.sort(this.dateSortAsc)
		});
	}
	render() {
		let records = 0;
		return (
			<div>
				<h1>Basic Fuzzy Search</h1>
				<input
					type="text"
					value={this.state.wordToSearch}
					onChange={this._onChangeInput}
				/>
				<br />
				<ul>
					{this.state.transactions.map(t => {
						if (t.match) {
							records++;
							return (
								<li style={divStyle} key={t.id}>
									<span style={spanStyle}>
										Amount: {t.amount}{" "}
									</span>
									<span style={spanStyle}>
										Date: {t.date}{" "}
									</span>
									<span style={spanStyle}>
										Card Last Four: {t.card_last_four}{" "}
									</span>
								</li>
							);
						}
					})}
				</ul>
				<br />
				<span>Total records: {records} </span>
			</div>
		);
	}
}
