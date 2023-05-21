const $dropdown = $(".dropdown");
const $dropdownToggle = $(".dropdown-toggle");
const $dropdownMenu = $(".dropdown-menu");
const showClass = "show";
$(window).on("load resize", function () {
  if (this.matchMedia("(min-width: 768px)").matches) {
    $dropdown.hover(
      function () {
        const $this = $(this);
        $this.addClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "true");
        $this.find($dropdownMenu).addClass(showClass);
      },
      function () {
        const $this = $(this);
        $this.removeClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "false");
        $this.find($dropdownMenu).removeClass(showClass);
      }
    );
  } else {
    $dropdown.off("mouseenter mouseleave");
  }
});

// 


let date = new Date();
const weekOfDay = ['일', '월', '화', '수', '목', '금', '토'];

for (let i = 1; i <= 7; i++) {
  for (let j = 0; j <= 1; j++) {
    let shownDate = document.querySelectorAll(`#date${i}`)[j];
    shownDate.textContent = date.getMonth() + 1 + '.' + date.getDate() + ' ' + weekOfDay[date.getDay()];
  }
  date.setDate(date.getDate() + 1);
}