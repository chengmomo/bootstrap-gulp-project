$(function() {
	var age = new Date().getFullYear() - 1993;
	$("#age").html(age + '岁')

	// Collapse Navbar
	var navbarCollapse = function() {
		if ($("#mainNav").offset().top > 100) {
			$("#mainNav").addClass("navbar-scrolled");
		} else {
			$("#mainNav").removeClass("navbar-scrolled");
		}
	};
	// Collapse now if page is not at top
	navbarCollapse();
	// Collapse the navbar when page is scrolled
	$(window).scroll(navbarCollapse);
})
