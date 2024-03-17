export function useStoredQueries() {
	const currentKey = 'repl_query_current';
	const historyKey = 'repl_query_history';
	const storedCurrent = localStorage.getItem(currentKey);
	const storedHistory = localStorage.getItem(historyKey);
	let current = $state(storedCurrent ?? '');
	let history = $state(storedHistory ? (JSON.parse(storedHistory) as string[]) : []);

	$effect(function updateCurrent() {
		localStorage.setItem(currentKey, current);
	});

	$effect(function updateHistory() {
		localStorage.setItem(historyKey, JSON.stringify(history));
	});

	return {
		get current() {
			return current;
		},
		set current(value) {
			current = value;
		},
		get history() {
			return history;
		},
		pushHistory() {
			const currentTrimmed = current.trim();
			if (currentTrimmed.length === 0) return;
			const foundIndex = history.findIndex((value) => value === currentTrimmed);
			if (foundIndex >= 0) {
				history.splice(foundIndex, 1);
			}
			history.unshift(currentTrimmed);
			history = history.slice(0, 50);
		},
		setFromHistory(index: number) {
			if (0 <= index && index < history.length) {
				current = history[index];
			}
		},
		deleteHistory(index: number) {
			if (0 <= index && index < history.length) {
				history.splice(index, 1);
			}
		},
		clearHistory() {
			history = [];
		},
	};
}
