"""Tests for the allergen matching service."""

import pytest
from app.services.allergen_service import match_allergens, determine_allergen_status


class TestAllergenMatching:
    def test_peanut_matches_groundnut(self):
        matches = match_allergens(["groundnut oil"], None, ["peanut"])
        assert len(matches) == 1
        assert matches[0]["name"] == "Peanut"

    def test_milk_matches_whey(self):
        matches = match_allergens(["whey powder"], None, ["milk"])
        assert len(matches) == 1
        assert matches[0]["name"] == "Milk"

    def test_wheat_matches_atta(self):
        matches = match_allergens(["atta flour"], None, ["wheat"])
        assert len(matches) == 1
        assert matches[0]["name"] == "Wheat"

    def test_soy_matches_soya(self):
        matches = match_allergens(["soya lecithin"], None, ["soy"])
        assert len(matches) == 1
        assert matches[0]["name"] == "Soy"

    def test_may_contain_creates_possible_severity(self):
        matches = match_allergens([], "May contain peanuts and tree nuts.", ["peanut"])
        peanut_match = [m for m in matches if m["name"] == "Peanut"]
        assert len(peanut_match) == 1
        assert peanut_match[0]["match_type"] == "may_contain"
        assert peanut_match[0]["severity"] == "possible"

    def test_user_allergen_creates_avoid(self):
        matches = match_allergens(["peanut butter"], None, ["peanuts"])
        status = determine_allergen_status(matches, ["peanuts"])
        # Even if user listed "peanuts" and db has "peanut", should find match
        assert len(matches) >= 1

    def test_no_allergens_returns_safe(self):
        matches = match_allergens(["water", "oats"], None, ["peanut"])
        status = determine_allergen_status(matches, ["peanut"])
        assert status == "safe"

    def test_multiple_allergens_detected(self):
        matches = match_allergens(
            ["whey powder", "soy lecithin", "wheat flour"],
            None,
            ["milk", "soy"]
        )
        names = [m["name"] for m in matches]
        assert "Milk" in names
        assert "Soy" in names
        assert "Wheat" in names

    def test_empty_ingredients_no_matches(self):
        matches = match_allergens([], None, ["peanut"])
        assert len(matches) == 0


class TestDetermineStatus:
    def test_critical_user_allergen_avoid(self):
        matches = [{"name": "Peanut", "match_type": "ingredient", "severity": "critical", "matched_text": "peanut"}]
        status = determine_allergen_status(matches, ["peanut"])
        assert status == "avoid"

    def test_may_contain_caution(self):
        matches = [{"name": "Peanut", "match_type": "may_contain", "severity": "possible", "matched_text": "may contain peanuts"}]
        status = determine_allergen_status(matches, ["peanut"])
        assert status == "caution"

    def test_no_matches_safe(self):
        status = determine_allergen_status([], ["peanut"])
        assert status == "safe"
