# Learning System Reference

The design system includes a learning and optimization layer that improves recommendations over time.

## Learning Data Storage

### Project-Level Learning

Store in `.design-system-learning.json`:

```json
{
  "projectId": "uuid",
  "sector": "fintech",
  "sessions": [
    {
      "sessionId": "abc123",
      "date": "2025-01-22",
      "brief": "Landing page for fintech startup",
      "finalScore": 8.7,
      "iterations": 5,
      "successfulPatterns": [
        {
          "type": "color",
          "pattern": "Blue primary with green success accents",
          "impact": "+0.5 score"
        },
        {
          "type": "layout",
          "pattern": "Hero with social proof bar",
          "impact": "+0.3 sector alignment"
        }
      ],
      "failedPatterns": [
        {
          "type": "visual",
          "pattern": "Gradient background on hero",
          "reason": "Too generic, high vibe-code score"
        }
      ],
      "criticInsights": {
        "mostHelpful": "vibe-code-detector",
        "leastHelpful": null,
        "calibrationNotes": []
      }
    }
  ],
  "aggregatedInsights": {
    "averageIterations": 5.2,
    "averageFinalScore": 8.5,
    "topPatterns": [],
    "commonIssues": []
  }
}
```

### Global Learning (Cross-Project)

Store in `~/.design-system/learning.json`:

```json
{
  "sectorPatterns": {
    "fintech": {
      "successfulColors": [
        { "palette": "blue-green", "successRate": 0.85 },
        { "palette": "blue-gray", "successRate": 0.78 }
      ],
      "successfulLayouts": [
        { "layout": "hero-features-testimonials", "successRate": 0.82 }
      ],
      "avoidPatterns": [
        { "pattern": "gradient-backgrounds", "failureRate": 0.65 }
      ]
    },
    "healthcare": { ... },
    "ecommerce": { ... }
  },
  "criticCalibration": {
    "spatial-auditor": { "weight": 1.0, "reliability": 0.92 },
    "color-judge": { "weight": 1.0, "reliability": 0.88 },
    "vibe-code-detector": { "weight": 1.1, "reliability": 0.95 }
  },
  "strategyEffectiveness": {
    "exploreToExploit": {
      "averageIterations": 3.2,
      "successRate": 0.75
    },
    "earlyPivot": {
      "averageIterations": 2.1,
      "successRate": 0.68
    }
  }
}
```

## Learning Mechanisms

### 1. Pattern Success Tracking

After each successful design (score ≥ quality gate):

```python
def record_success(session):
    for decision in session.lockedDecisions:
        pattern = extract_pattern(decision)
        sector = session.brief.sector

        # Update pattern success rate
        learning.sectorPatterns[sector][pattern.type].append({
            "pattern": pattern.description,
            "score_impact": pattern.impact,
            "context": session.brief.summary
        })
```

### 2. Failure Pattern Tracking

After failed approaches or low scores:

```python
def record_failure(session, iteration):
    for approach in iteration.failedApproaches:
        learning.sectorPatterns[sector].avoidPatterns.append({
            "pattern": approach.description,
            "reason": approach.failureReason,
            "context": session.brief.summary
        })
```

### 3. Critic Calibration

Track which critics provide most useful feedback:

```python
def calibrate_critics(session):
    for iteration in session.iterations:
        for critic, feedback in iteration.criticFeedback:
            # Did addressing this feedback improve score?
            if next_iteration.score > iteration.score:
                critic.successfulSuggestions += 1
            else:
                critic.unsuccessfulSuggestions += 1

    # Adjust weights based on reliability
    for critic in critics:
        critic.reliability = (
            critic.successfulSuggestions /
            (critic.successfulSuggestions + critic.unsuccessfulSuggestions)
        )
        critic.weight = 0.8 + (critic.reliability * 0.4)  # Range: 0.8-1.2
```

### 4. Strategy Optimization

Track which strategies work best:

```python
def optimize_strategy(session):
    strategy_path = session.strategyPath  # e.g., ["explore", "exploit", "complete"]

    learning.strategyEffectiveness[strategy_path].append({
        "iterations": session.totalIterations,
        "finalScore": session.finalScore,
        "qualityGatesMetAt": session.gatesMetIteration
    })

    # Identify optimal strategies per sector
    for sector in learning.sectorPatterns:
        best_strategy = find_best_strategy(sector)
        learning.sectorPatterns[sector].recommendedStrategy = best_strategy
```

## Applying Learned Knowledge

### During Research Phase

```python
def enhance_research(brief, learning):
    sector = brief.sector

    # Recommend proven patterns
    recommendations = []
    for pattern in learning.sectorPatterns[sector].successfulColors:
        if pattern.successRate > 0.7:
            recommendations.append({
                "type": "color",
                "suggestion": pattern.palette,
                "confidence": pattern.successRate
            })

    # Warn about failed patterns
    warnings = []
    for pattern in learning.sectorPatterns[sector].avoidPatterns:
        if pattern.failureRate > 0.5:
            warnings.append({
                "type": pattern.type,
                "avoid": pattern.description,
                "reason": pattern.reason
            })

    return recommendations, warnings
```

### During Strategy Selection

```python
def select_strategy(state, learning):
    sector = state.brief.sector

    # Check if we have learning data for this sector
    if sector in learning.sectorPatterns:
        recommended = learning.sectorPatterns[sector].recommendedStrategy

        # Adjust phase transitions based on learned data
        if recommended.earlyExploit:
            state.exploreThreshold = 6.5  # Lower than default 7.0
        if recommended.quickPivot:
            state.plateauTolerance = 1  # Pivot after 1 plateau instead of 2
```

### During Review

```python
def adjust_critic_weights(learning):
    weights = {}
    for critic, calibration in learning.criticCalibration.items():
        weights[critic] = calibration.weight * calibration.reliability

    # Normalize to sum to 1.0
    total = sum(weights.values())
    return {k: v/total for k, v in weights.items()}
```

## Privacy & Data Management

### Data Retention

```json
{
  "retention": {
    "projectLearning": "indefinite",
    "globalLearning": "90 days rolling",
    "sensitiveData": "never stored"
  },
  "excludedFromLearning": [
    "briefContent",
    "generatedCode",
    "clientNames",
    "proprietaryPatterns"
  ]
}
```

### Opt-Out

Users can disable learning:

```json
// .design-system.json
{
  "learning": {
    "enabled": false,
    "shareAnonymousData": false
  }
}
```

## Learning Metrics Dashboard

Track learning effectiveness:

```markdown
## Learning Metrics

### This Project
- Sessions: 12
- Average Score: 8.6
- Improvement over baseline: +15%

### Global (Your Patterns)
- Total sessions: 47
- Sectors covered: 5
- Top pattern: "Blue primary + green accent" (23 uses, 87% success)
- Most reliable critic: vibe-code-detector (95% accuracy)

### Recommendations
Based on your history:
1. Start with "hero-features-social proof" layout (82% success in fintech)
2. Avoid gradient backgrounds (65% failure rate)
3. Consider early pivot if score < 6.5 after iteration 2
```

## Future Learning Capabilities

### Planned Enhancements

1. **Visual Learning**
   - Screenshot comparison between iterations
   - Learn which visual changes improve scores

2. **User Feedback Integration**
   - Collect explicit feedback on generated designs
   - Weight learning by user satisfaction

3. **Cross-User Learning (Opt-in)**
   - Aggregate anonymous patterns across users
   - Identify universal best practices

4. **A/B Testing Integration**
   - Track real-world performance of generated designs
   - Learn from conversion data
