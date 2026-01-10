from apps.api.services.trust import TrustEngine, FinancialProfileInput, BuyerTier
from apps.api.services.reputation import ReputationEngine, BuilderMetrics
import pytest

def test_trust_engine_platinum():
    # High Income, Good Credit, High Assets
    profile = FinancialProfileInput(
        monthly_surplus=250000, # Score 100
        credit_score=820,       # Score 100
        verified_asset_value=12000000 # > 1Cr -> Score 100
    )
    result = TrustEngine.compute_trust_profile(profile)
    assert result["tier"] == BuyerTier.PLATINUM
    assert result["trust_score"] == 100

def test_trust_engine_silver_promoter():
    # Promoter case: Low/Mid Income flow but High Assets
    profile = FinancialProfileInput(
        monthly_surplus=60000,  # Score 70
        credit_score=720,       # Score 75
        verified_asset_value=6000000 # > 50L -> Score 80
    )
    # Calc: (70*0.5) + (80*0.3) + (75*0.2) = 35 + 24 + 15 = 74
    result = TrustEngine.compute_trust_profile(profile)
    assert result["trust_score"] == 74
    assert result["tier"] == BuyerTier.SILVER  # Just missed Gold

def test_reputation_bad_builder():
    metrics = BuilderMetrics(
        avg_delivery_delay_days=365, # Score: 100 - 54.75 = 45.25
        legal_cases_count=5,         # Score: 100 - 50 = 50
        customer_sentiment_score=40  # Score: 40
    )
    # Calc: (45.25 * 0.4) + (50 * 0.3) + (40 * 0.3)
    #     = 18.1 + 15 + 12 = 45.1
    score = ReputationEngine.calculate_score(metrics)
    assert score == 45
