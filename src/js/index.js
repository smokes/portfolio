function changeTheme(theme) {
	themeButton = document.getElementById("themer");
	if (
		theme === "dark" &&
		!document.documentElement.getAttribute("data-theme")
	) {
		document.documentElement.setAttribute("data-theme", "dark");
		themeButton.getElementsByTagName("i")[0].className = "icon-brightness-up";
	} else if (theme === "light") {
		document.documentElement.removeAttribute("data-theme");
		themeButton.getElementsByTagName("i")[0].className = "fas fa-moon";
	} else {
		return;
	}
}

function themerHandler() {
	if (!document.documentElement.getAttribute("data-theme")) {
		changeTheme("dark");
		localStorage.setItem("theme", "dark");
	} else {
		changeTheme("light");
		localStorage.setItem("theme", "light");
	}
}

function checkTheme() {
	darkTheme = window.localStorage.getItem("theme");
	if (!darkTheme) {
		return;
	} else {
		changeTheme(darkTheme);
	}
}

function checkPreference() {
	darkMode =
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;
	if (!window.localStorage.getItem("theme")) {
		if (darkMode) {
			window.localStorage.setItem("theme", "dark");
			changeTheme("dark");
		} else {
			window.localStorage.setItem("theme", "light");
			changeTheme("light");
		}
	} else {
		return;
	}
}

document.addEventListener("DOMContentLoaded", function() {
	setTimeout(() => {
		document.documentElement.classList.add("transition");
	}, 100);

	checkTheme();
	checkPreference();
});
