import os
from typing import TypedDict
import streamlit.components.v1 as components

_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component(
        "st_span_annotation",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("st_span_annotation", path=build_dir)


class Span(TypedDict):
    start: int
    end: int
    label: str
    text: str


def st_span_annotation(
    text: str,
    labels: list[str],
    spans: list[Span] = [],
    color_palette: dict[str, str] = {},
) -> Span:
    component_value = _component_func(
        text=text,
        labels=labels,
        spans=spans,
        color_palette=color_palette,
    )
    return component_value
