# st-span-annotation

Streamlit component to annotate text span

**Note: This repository is under active development and is not yet ready for production use.**

## Usage instructions

```python
import streamlit as st
from st_span_annotation import st_span_annotation, Span

text = "Hello!!!\nThis is some annotated text for those of you who like this sort of thing."
labels = ["VERB", "ADJ", "NOUN", "PRONOUN"]
initial_spans: list[Span] = [
  {
    "start": 0,
    "end: 5,
    "label": "PERSON",
    "text": "Hello",
  }
]
color_palette = {
    "PERSON": "lightblue",
    "COMPANY": "lightcoral",
    "TIME": "lightgreen",
    "QUANTITY": "lightgoldenrodyellow",
}

result: list[dict] = st_span_annotation(
    text=text,
    labels=labels,
    spans=initial_spans,
    color_palette=color_palette,
    key="span_annotation",
)

st.write(result)

```
