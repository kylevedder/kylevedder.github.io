HEADER Argoverse 2 Validation split full visualization

<!-- Include the `val.css` -->
<link rel="stylesheet" href="../av_vis.css">

# Argoverse 2 Validation split full visualization

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
<button type="button" onclick="searchCallback()">Search</button>
</form>
<p>Num Entries found: <span id="num_found">-1</span></p>

PYTHON ./preview_gen.py ./range_None/


<script id="search_js" type="text/javascript" data-data_dir="./range_None" src="../av_vis_search.js"></script>
