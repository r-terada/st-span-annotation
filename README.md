# st-span-annotation

Streamlit component to annotate text span

## Usage instructions

```python
from typing import TypedDict

import streamlit as st
from st_span_annotation import st_span_annotation

class Span(TypedDict):
    start: int
    end: int
    label: str
    text: str


text = """Alice and Bob are planning to visit New York next week.
They will be attending a conference on AI."""
labels = ["PERSON", "LOCATION", "DATE", "EVENT"]
initial_spans: list[Span] = [
    {"start": 0, "end": 5, "label": "PERSON", "text": "Alice"},
    {"start": 36, "end": 44, "label": "LOCATION", "text": "New York"},
    {"start": 45, "end": 54, "label": "DATE", "text": "next week"},
    {"start": 81, "end": 97, "label": "EVENT", "text": "conference on AI"},
]
color_palette: dict[str, str] = {
    "PERSON": "lightblue",
    "LOCATION": "lightgreen",
    "DATE": "lightyellow",
    "EVENT": "lightcoral",
}

result: list[Span] = st_span_annotation(
    text=text,
    labels=labels,
    spans=initial_spans,  # optional
    color_palette=color_palette,  # optional
)

st.write(result)
```
