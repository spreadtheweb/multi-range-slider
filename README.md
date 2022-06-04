# Multi Range Slider
Simple, small and fast vanilla JavaScript multi range slider without dependencies, with ability to have multiple values and points to slide

![illustration](https://github.com/spreadtheweb/multi-range-slider/blob/master/example/rang-slider.gif?raw=true)

## WHY
I wanted range slider to use in my project but there were no sliders with multiple points and values. Some libraries have it but they were either more complex or there was no ability to extract it.

## Installation
You can install package from npm registry using:
```
npm i @spreadtheweb/multi-range-slider
```
Or by directly inserting it into html using unpkg link:
```
<script src="https://unpkg.com/@spreadtheweb/multi-range-slider@1.0.2/dist/range-slider.main.min.js"></script>
```

## Usage
You can call constractor and pass selector of your html div element and additional options. Returns slider instance.
```
new RangeSlider(selector: text, options?: {})
```
You can import it into your module:
```
import RangeSlider from '@spreadtheweb/multi-range-slider';

new RangeSlider(".range-slider-1")
    .onChange(val => console.log(val));
```
Or you can use it directly in your html:
```
<head>
    ...
    <script src="https://unpkg.com/@spreadtheweb/multi-range-slider@1.0.2/dist/range-slider.main.min.js"></script>
</head>
<body>
    <div class="slider"></div>

    <script>
        let slider = new RangeSlider('.slider')
    </script>
</body>
```

## Options
| Property      | Type | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| values      | number[]       | [25, 75] | Initial Value | 
| step   | number        | 1 | incement of value per point move |
| min   | number        | 0 | possible min value |
| max   | number        | 100 | possible max value |
| colors   | Object {points: string[] or string, rail: string, tracks: string[] or string}        | ```{points: "rgb(25, 118, 210)", rail: "rgba(25, 118, 210, 0.4)", tracks: "rgb(25, 118, 210)"}``` | color of points, rail and tracks. Points ant tracks can have array of colors for relateive point/track in order |
| pointRadius   | number        | 15 | radius of point in px |
| railHeight   | number        | 5 | height of rail in px |
| trackHeight   | number        | 5 | height of track in px |

## Methods
| Method name    |   Usage | Usage |
| ----------- |  ----------- | ----------- |
| onChange | ``` slider.onChange(values => console.log(values)) ``` | calls received callback and pass current values when point slide finishes |

## Examples
See example folder in git repository