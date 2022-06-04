/*
    This is a RangeSlider html component for one of my projects
    It allows to have multiple points and different ranges of values with specified steps to jumb.
    It has a easy api to customize sizes and colors of points, tracks, etc.
    It has onChange method, which receives and callback and calls it with current values
*/

import "./range-slider.css";

export default class RangeSlider {
    /**
     * Create slider
     * @param  {string} selector
     * @param  {object} props={}
     */
    constructor(selector, props = {}) {
        this.defaultProps = {
            values: [25, 75],
            step: 1,
            min: 0,
            max: 100,
            colors: {
                points: "rgb(25, 118, 210)", // ['red', 'green', 'blue']
                rail: "rgba(25, 118, 210, 0.4)",
                tracks: "rgb(25, 118, 210)" // // ['red', 'green']
            },
            pointRadius: 15,
            railHeight: 5,
            trackHeight: 5
        };

        this.allProps = {
            ...this.defaultProps,
            ...props,
            values: [...(props.values || this.defaultProps.values)],
            colors: {
                ...this.defaultProps.colors,
                ...props.colors
            }
        };

        this.container = this.initContainer(selector);
        this.pointPositions = this.generatePointPositions();
        this.possibleValues = this.generatePossibleValues();
        this.jump =
            this.container.offsetWidth /
            Math.ceil(
                (this.allProps.max - this.allProps.min) / this.allProps.step
            );

        this.rail = this.initRail();
        this.tracks = this.initTracks(this.allProps.values.length - 1);
        this.tooltip = this.initTooltip();
        this.points = this.initPoints(this.allProps.values.length);

        this.drawScene();

        this.documentMouseupHandler = this.documentMouseupHandler.bind(this);
        this.documentMouseMoveHandler = this.documentMouseMoveHandler.bind(
            this
        );
        this.selectedPointIndex = -1;

        this.changeHandlers = [];

        return this;
    }

    /**
     * Draw all elements with initial positions
     */
    drawScene() {
        this.container.classList.add("range-slider__container");
        this.container.appendChild(this.rail);
        this.container.appendChild(this.tooltip);

        this.tracks.forEach(track => this.container.appendChild(track));
        this.points.forEach(point => this.container.appendChild(point));
    }

    generatePointPositions() {
        return this.allProps.values.map(value => {
            let percentage = (value / this.allProps.max) * 100;
            return Math.floor((percentage / 100) * this.container.offsetWidth);
        });
    }

    /**
     * Generate all values that can slider have starting from min, to max increased by step
     */
    generatePossibleValues() {
        let values = [];

        for (
            let i = this.allProps.min;
            i <= this.allProps.max;
            i += this.allProps.step
        ) {
            values.push(Math.round(i * 100) / 100);
        }

        if (this.allProps.max % this.allProps.step > 0) {
            values.push(Math.round(this.allProps.max * 100) / 100);
        }

        return values;
    }
    /**
     * Initialize container
     * @param  {string} selector
     */
    initContainer(selector) {
        const container = document.querySelector(selector);
        container.classList.add("range-slider__container");

        container.style.height = this.allProps.pointRadius * 2 + "px";

        return container;
    }

    /**
     * Initialize Rail
     */
    initRail() {
        const rail = document.createElement("span");
        rail.classList.add("range-slider__rail");

        rail.style.background = this.allProps.colors.rail;
        rail.style.height = this.allProps.railHeight + "px";
        rail.style.top = this.allProps.pointRadius + "px";

        rail.addEventListener("click", e => this.railClickHandler(e));

        return rail;
    }

    /**
     * Initialize all tracks (equal to number of points - 1)
     * @param  {number} count
     */
    initTracks(count) {
        let tracks = [];
        for (let i = 0; i < count; i++) {
            tracks.push(this.initTrack(i));
        }

        return tracks;
    }

    /**
     * Initialize single track at specific index position
     * @param  {number} index
     */
    initTrack(index) {
        const track = document.createElement("span");
        track.classList.add("range-slider__track");
        let trackPointPositions = this.pointPositions.slice(index, index + 2);

        track.style.left = Math.min(...trackPointPositions) + "px";
        track.style.top = this.allProps.pointRadius + "px";
        track.style.width =
            Math.max(...trackPointPositions) -
            Math.min(...trackPointPositions) +
            "px";
        track.style.height = this.allProps.trackHeight + "px";

        let trackColors = this.allProps.colors.tracks;
        track.style.background = Array.isArray(trackColors)
            ? trackColors[index] || trackColors[trackColors.length - 1]
            : trackColors;

        track.addEventListener("click", e => this.railClickHandler(e));

        return track;
    }

    /**
     * Initialize all points (equal to number of values)
     * @param  {number} count
     */
    initPoints(count) {
        let points = [];
        for (let i = 0; i < count; i++) {
            points.push(this.initPoint(i));
        }

        return points;
    }

    /**
     * Initialize single track at specific index position
     * @param  {number} index
     */
    initPoint(index) {
        const point = document.createElement("span");
        point.classList.add("range-slider__point");

        point.style.width = this.allProps.pointRadius * 2 + "px";
        point.style.height = this.allProps.pointRadius * 2 + "px";
        point.style.left = `${(this.pointPositions[index] /
            this.container.offsetWidth) *
            100}%`;
        let pointColors = this.allProps.colors.points;
        point.style.background = Array.isArray(pointColors)
            ? pointColors[index] || pointColors[pointColors.length - 1]
            : pointColors;

        point.addEventListener("mousedown", e =>
            this.pointClickHandler(e, index)
        );
        point.addEventListener("mouseover", e =>
            this.pointMouseoverHandler(e, index)
        );
        point.addEventListener("mouseout", e =>
            this.pointMouseOutHandler(e, index)
        );

        return point;
    }

    /**
     * Initialize tooltip
     */
    initTooltip() {
        const tooltip = document.createElement("span");
        tooltip.classList.add("range-slider__tooltip");
        tooltip.style.fontSize = this.allProps.pointRadius + "px";

        return tooltip;
    }

    /**
     * Draw points, tracks and tooltip (on rail click or on drag)
     */
    draw() {
        this.points.forEach((point, i) => {
            point.style.left = `${(this.pointPositions[i] /
                this.container.offsetWidth) *
                100}%`;
        });

        this.tracks.forEach((track, i) => {
            let trackPointPositions = this.pointPositions.slice(i, i + 2);
            track.style.left = Math.min(...trackPointPositions) + "px";
            track.style.width =
                Math.max(...trackPointPositions) -
                Math.min(...trackPointPositions) +
                "px";
        });

        this.tooltip.style.left =
            this.pointPositions[this.selectedPointIndex] + "px";
        this.tooltip.textContent = this.allProps.values[
            this.selectedPointIndex
        ];
    }

    /**
     * Redraw on rail click
     * @param  {Event} e
     */
    railClickHandler(e) {
        let newPosition = this.getMouseRelativePosition(e.pageX);
        let closestPositionIndex = this.getClosestPointIndex(newPosition);
        this.pointPositions[closestPositionIndex] = newPosition;

        this.draw();
    }

    /**
     * Find the closest possible point position fro current mouse position
     * in order to move the point
     * @param  {number} mousePoisition
     */
    getClosestPointIndex(mousePoisition) {
        let shortestDistance = Infinity;
        let index = 0;
        for (let i in this.pointPositions) {
            let dist = Math.abs(mousePoisition - this.pointPositions[i]);
            if (shortestDistance > dist) {
                shortestDistance = dist;
                index = i;
            }
        }

        return index;
    }

    /**
     * Stop point moving on mouse up
     */
    documentMouseupHandler() {
        this.changeHandlers.forEach(func => func(this.allProps.values));
        this.points[this.selectedPointIndex].style.boxShadow = `none`;
        this.selectedPointIndex = -1;
        this.tooltip.style.transform = "translate(-50%, -60%) scale(0)";
        document.removeEventListener("mouseup", this.documentMouseupHandler);
        document.removeEventListener(
            "mousemove",
            this.documentMouseMoveHandler
        );
    }

    /**
     * Start point moving on mouse move
     * @param {Event} e
     */
    documentMouseMoveHandler(e) {
        let newPoisition = this.getMouseRelativePosition(e.pageX);
        let extra = Math.floor(newPoisition % this.jump);
        if (extra > this.jump / 2) {
            newPoisition += this.jump - extra;
        } else {
            newPoisition -= extra;
        }
        if (newPoisition < 0) {
            newPoisition = 0;
        } else if (newPoisition > this.container.offsetWidth) {
            newPoisition = this.container.offsetWidth;
        }
        this.pointPositions[this.selectedPointIndex] = newPoisition;

        this.allProps.values[this.selectedPointIndex] = this.possibleValues[
            Math.floor(newPoisition / this.jump)
        ];
        this.draw();
    }

    /**
     * Register document listeners on point click
     * and save clicked point index
     * @param {Event} e
     */
    pointClickHandler(e, index) {
        e.preventDefault();
        this.selectedPointIndex = index;
        document.addEventListener("mouseup", this.documentMouseupHandler);
        document.addEventListener("mousemove", this.documentMouseMoveHandler);
    }

    /**
     * Point mouse over box shadow and tooltip displaying
     * @param {Event} e
     * @param {number} index
     */
    pointMouseoverHandler(e, index) {
        const transparentColor = RangeSlider.addTransparencyToColor(
            this.points[index].style.backgroundColor,
            16
        );
        if (this.selectedPointIndex < 0) {
            this.points[index].style.boxShadow = `0px 0px 0px ${Math.floor(
                this.allProps.pointRadius / 1.5
            )}px ${transparentColor}`;
        }
        this.tooltip.style.transform = "translate(-50%, -60%) scale(1)";
        this.tooltip.style.left = this.pointPositions[index] + "px";
        this.tooltip.textContent = this.allProps.values[index];
    }

    /**
     * Add transparency for rgb, rgba or hex color
     * @param {string} color
     * @param {number} percentage
     */
    static addTransparencyToColor(color, percentage) {
        if (color.startsWith("rgba")) {
            return color.replace(/(\d+)(?!.*\d)/, percentage + "%");
        }

        if (color.startsWith("rgb")) {
            let newColor = color.replace(/(\))(?!.*\))/, `, ${percentage}%)`);
            return newColor.replace("rgb", "rgba");
        }

        if (color.startsWith("#")) {
            return color + percentage.toString(16);
        }

        return color;
    }

    /**
     * Hide shadow and tooltip on mouse out
     * @param {Event} e
     * @param {number} index
     */
    pointMouseOutHandler(e, index) {
        if (this.selectedPointIndex < 0) {
            this.points[index].style.boxShadow = `none`;
            this.tooltip.style.transform = "translate(-50%, -60%) scale(0)";
        }
    }

    /**
     * Get mouse position relatively from containers left position on the page
     */
    getMouseRelativePosition(pageX) {
        return pageX - this.container.offsetLeft;
    }

    /**
     * Register onChange callback to call it on slider move end passing all the present values
     */
    onChange(func) {
        if (typeof func !== "function") {
            throw new Error("Please provide function as onChange callback");
        }
        this.changeHandlers.push(func);
        return this;
    }
}
