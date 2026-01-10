from enum import Enum
from typing import Optional
from pydantic import BaseModel

class BuyerTier(str, Enum):
    PLATINUM = "PLATINUM"
    GOLD = "GOLD"
    SILVER = "SILVER"
    BRONZE = "BRONZE"

class FinancialProfileInput(BaseModel):
    monthly_surplus: float
    credit_score: int
    verified_asset_value: float = 0.0
    loan_active: bool = False

class TrustEngine:
    """
    Core Logic for the 'Financial Confidence Profile'.
    We do NOT store raw data, we compute scores on the fly or persist only the score.
    """

    @staticmethod
    def calculate_income_score(surplus: float) -> int:
        if surplus > 200000: return 100
        if surplus > 100000: return 85
        if surplus > 50000: return 70
        return 50

    @staticmethod
    def calculate_credit_score(cibil: int) -> int:
        if cibil >= 800: return 100
        if cibil >= 750: return 90
        if cibil >= 700: return 75
        if cibil >= 650: return 60
        return 40

    @staticmethod
    def calculate_asset_score(asset_value: float) -> int:
        # Asset backing provides huge confidence boost
        if asset_value > 10000000: return 100 # > 1 Cr
        if asset_value > 5000000: return 80   # > 50 L
        if asset_value > 0: return 60
        return 40  # No assets declared

    @classmethod
    def compute_trust_profile(cls, profile: FinancialProfileInput) -> dict:
        # 1. Component Scores
        s_income = cls.calculate_income_score(profile.monthly_surplus)
        s_credit = cls.calculate_credit_score(profile.credit_score)
        s_asset = cls.calculate_asset_score(profile.verified_asset_value)

        # 2. Weighted Algorithm (From PRD)
        # Score = (Income * 0.5) + (Asset * 0.3) + (Credit * 0.2)
        raw_score = (s_income * 0.5) + (s_asset * 0.3) + (s_credit * 0.2)
        final_score = round(raw_score)

        # 3. Tiering
        tier = BuyerTier.BRONZE
        if final_score >= 90: tier = BuyerTier.PLATINUM
        elif final_score >= 75: tier = BuyerTier.GOLD
        elif final_score >= 60: tier = BuyerTier.SILVER

        return {
            "trust_score": final_score,
            "tier": tier,
            "components": {
                "income_stability": s_income,
                "asset_backing": s_asset,
                "credit_worthiness": s_credit
            },
            "loan_readiness": "HIGH" if final_score > 70 else "MODERATE"
        }
