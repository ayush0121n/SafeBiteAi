"""Tests for the concern evaluation service."""

import pytest
from app.services.concern_service import evaluate_concerns, determine_overall_status


class TestConcernEvaluation:
    def test_high_sodium_with_hypertension(self):
        concerns = evaluate_concerns(
            {"sodium_mg": 700},
            ["hypertension"],
            [],
            ["salt", "sodium chloride"],
        )
        assert len(concerns) >= 1
        sodium_concern = [c for c in concerns if c["category"] == "blood_pressure"]
        assert sodium_concern[0]["level"] == "higher"

    def test_high_sugar_with_diabetes(self):
        concerns = evaluate_concerns(
            {"added_sugar_g": 20},
            ["diabetes"],
            [],
            ["sugar", "corn syrup"],
        )
        sugar_concern = [c for c in concerns if c["category"] == "blood_sugar"]
        assert len(sugar_concern) >= 1
        assert sugar_concern[0]["level"] == "higher"

    def test_moderate_sat_fat_with_heart_health(self):
        concerns = evaluate_concerns(
            {"saturated_fat_g": 4},
            ["heart_health"],
            [],
            ["palm oil"],
        )
        fat_concern = [c for c in concerns if c["category"] == "heart_health"]
        assert len(fat_concern) >= 1
        assert fat_concern[0]["level"] == "moderate"

    def test_no_concerns_when_values_are_low(self):
        concerns = evaluate_concerns(
            {"sodium_mg": 100, "added_sugar_g": 2, "saturated_fat_g": 1},
            [],
            [],
            ["oats", "water"],
        )
        assert len(concerns) == 0

    def test_low_preference_triggers_concern(self):
        concerns = evaluate_concerns(
            {"sodium_mg": 700},
            [],
            ["low_sodium"],
            ["salt"],
        )
        assert len(concerns) >= 1


class TestOverallStatus:
    def test_low_ocr_returns_uncertain(self):
        status = determine_overall_status("safe", [], 0.5)
        assert status == "uncertain"

    def test_avoid_allergen_returns_avoid(self):
        status = determine_overall_status("avoid", [], 0.9)
        assert status == "avoid"

    def test_higher_concern_returns_caution(self):
        concerns = [{"level": "higher", "category": "blood_sugar", "title": "test", "plain_language_reason": "test", "factors": []}]
        status = determine_overall_status("safe", concerns, 0.9)
        assert status == "caution"

    def test_all_safe_returns_safe(self):
        status = determine_overall_status("safe", [], 0.95)
        assert status == "safe"
