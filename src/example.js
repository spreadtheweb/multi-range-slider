import RangeSlider from "./range-slider.js";

new RangeSlider(".range-slider-1").onChange(val => console.log(val));

new RangeSlider(".range-slider-2", {
    values: [20, 35, 45],
    min: 10,
    max: 50,
    step: 5,
    colors: {
        points: "#F77BF0",
        rail: "#F77BF030",
        tracks: "#F77BF0"
    }
}).onChange(val => console.log(val));

new RangeSlider(".range-slider-3", {
    pointRadius: 30,
    railHeight: 10,
    trackHeight: 10,
    colors: {
        points: "#A2E4B8",
        rail: "#A2E4B860",
        tracks: "#A2E4B8"
    }
});

new RangeSlider(".range-slider-4", {
    values: [15, 30, 50, 70],
    colors: {
        points: ["#540BEC", "#540BEC", "#F77BF0", "#F77BF0"], // ['blue', 'red']
        rail: "white",
        tracks: ["#540BEC", "transparent", "#F77BF0"]
    }
});

new RangeSlider(".range-slider-5", {
    values: [25, 50, 75],
    pointRadius: 20,
    railHeight: 6,
    trackHeight: 6,
    colors: {
        points: ["#540BEC", "#A2E4B8", "#F77BF0"], // ['blue', 'red']
        rail: "white",
        tracks: [
            "linear-gradient(90deg, #540BEC 0%, #A2E4B8 100%)",
            "linear-gradient(90deg, #A2E4B8 0%, #F77BF0 100%)"
        ]
    }
});