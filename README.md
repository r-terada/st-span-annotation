# st-span-annotation

Streamlit component to annotate text span

**Note: This repository is under active development and is not yet ready for production use.**

## Usage instructions

```python
import streamlit as st

from st_span_annotation import st_span_annotation

full_text = """Hello!!!
This is some annotated text for those of you who like this sort of thing.
"""
labels = ["VERB", "ADJ", "NOUN", "PRONOUN"]
color_palette = {
    "VERB": "lightblue",
    "ADJ": "lightcoral",
    "NOUN": "lightgreen",
    "PRONOUN": "lightgoldenrodyellow",
}

result: list[dict] = st_span_annotation(
    full_text=full_text,
    labels=labels,
    color_palette=color_palette,
    key="span_annotation",
)

st.write(result)

```
