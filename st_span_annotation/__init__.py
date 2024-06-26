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
    is_editable: bool = True,
    key: str | None = None,
) -> list[Span]:
    """Create a span annotation component.

    Args:
        text (str): text to be annotated
        labels (list[str]): list of labels
        spans (list[Span], optional): list of initial spans. Defaults to [].
        color_palette (dict[str, str], optional): dictionary of label-color pairs. if not provided, default colors will be used. Defaults to {}.
        is_editable (bool, optional): whether the spans are editable. Defaults to True.
        key (str | None, optional): An optional st component key that makes this component uniquely identifiable. Defaults to None.

    Returns:
        list[Span]: list of annotated spans
    """
    component_value = _component_func(
        text=text,
        labels=labels,
        spans=spans,
        color_palette=color_palette,
        is_editable=is_editable,
        key=key,
    )
    return component_value
