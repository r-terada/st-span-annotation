import os
import streamlit as st
from streamlit.components.v1 import declare_component

RELEASE = os.getenv("RELEASE", "false").lower() == "true"

if RELEASE:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    st_span_annotation = declare_component("st_span_annotation", path=build_dir)
else:
    st_span_annotation = declare_component(
        "st_span_annotation",
        url="http://localhost:3001",
    )


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
