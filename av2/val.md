HEADER AV2 Validation split visualization

<!-- Include the `val.css` -->
<link rel="stylesheet" href="val.css">


# AV2 Validation split visualization

<form>
<select name="category_menu">
<option value="">Any Category</option>
</select>
<div>
<label for="fixedValueSlider1">Min Speed:</label>
<input type="range" id="fixedValueSlider1" min="0" max="4" step="1" default="0">
<output id="sliderOutput1"></output>
</div>
<div>
<label for="fixedValueSlider2">Max Speed:</label>
<input type="range" id="fixedValueSlider2" min="0" max="4" step="1" default="4">
<output id="sliderOutput2"></output>
</div>
<button type="button" onclick="MySearch()">Search</button>
</form>
<p>Num Entries found: <span id="num_found">-1</span></p>

PYTHON ./val_preview_gen.py


<script src="val.js"></script>