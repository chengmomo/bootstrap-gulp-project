$(function() {
	var age = new Date().getFullYear() - 1993;
	$("#age").html(age + '岁')

    // bootstrap scrollspy: Activate scrollspy to add active class to navbar items on scroll
	// 搭配css的.active
	$('body').scrollspy({
		target: '#navbar-collapse', //data-target
		offset: 71
	})

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
