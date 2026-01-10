from pydantic import BaseModel

class BuilderMetrics(BaseModel):
    avg_delivery_delay_days: int
    legal_cases_count: int
    customer_sentiment_score: int # 0-100

class ReputationEngine:
    """
    Calculates Builder Trust Score.
    Inputs come from RERA (Delays) and eCourts (Legal).
    """

    @staticmethod
    def calculate_score(metrics: BuilderMetrics) -> int:
        # 1. Delivery Score (40% weight) - Penalize delays
        # 0 days = 100, 365 days = 50, 700+ days = 0
        delivery_score = max(0, 100 - (metrics.avg_delivery_delay_days * 0.15))

        # 2. Legal Score (30% weight) - Penalize open cases
        # 0 cases = 100, each case drops score
        legal_score = max(0, 100 - (metrics.legal_cases_count * 10))

        # 3. Sentiment (30% weight) - Direct pass through
        sentiment_score = metrics.customer_sentiment_score

        # Weighted Sum
        # Score = (Delivery * 0.4) + (Legal * 0.3) + (Sentiment * 0.3)
        final_score = (delivery_score * 0.4) + (legal_score * 0.3) + (sentiment_score * 0.3)
        
        return round(final_score)
