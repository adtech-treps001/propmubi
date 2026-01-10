# Floor Plan Extraction - Usage Guide

## Overview
Automated extraction of individual flat floor plans from PDF brochure pages with detailed metadata generation.

## Installation

```bash
pip install Pillow pdf2image
```

**Note**: `pdf2image` requires `poppler` to be installed:
- **Windows**: Download from https://github.com/oschwartz10612/poppler-windows/releases/
- **Linux**: `sudo apt-get install poppler-utils`
- **Mac**: `brew install poppler`

## Usage Examples

### 1. Extract Single Floor Plan Image

```bash
python extract_floor_plans.py \
    --single-page "floor_plan_page28.png" \
    --tower A \
    --floor 2 \
    --output-dir extracted_plans/
```

This will create:
```
extracted_plans/
├── towerA_floor02_flat1.png
├── towerA_floor02_flat2.png
├── towerA_floor02_flat3.png
├── towerA_floor02_flat4.png
├── towerA_floor02_flat5.png
├── towerA_floor02_flat6.png
├── towerA_floor02_flat7.png
├── towerA_floor02_flat8.png
└── towerA_floor02_metadata.yaml
```

### 2. Process Entire PDF

```bash
python extract_floor_plans.py \
    --pdf "My-Home-Sayuk_Brochure.pdf" \
    --output-dir extracted_plans/
```

### 3. Process Specific Page Range

```bash
python extract_floor_plans.py \
    --pdf "My-Home-Sayuk_Brochure.pdf" \
    --page-range 28 68 \
    --output-dir extracted_plans/
```

## Generated Metadata Example

Each floor generates a metadata YAML file:

```yaml
tower: A
floor: 2
extraction_date: '1764433368.055'
total_flats: 8
flats:
  flat1:
    position: top-left
    bhk: 3
    sqft: 2262
    carpet_area: 1733
    facing: East
    main_door_direction: West
    balcony_direction: East
    image_file: towerA_floor02_flat1.png
    bounds:
      x: 0
      y: 0
      width: 540
      height: 400
    rooms:
      living_dining:
        name: Living & Dining
        x: 50
        y: 120
        width: 280
        height: 220
        area_sqft: 252
        dimensions: 18'0" × 14'0"
        direction: East
        vastu: East/North (Excellent)
        features:
          - Large windows facing East
          - Combined living-dining space
          - Balcony access
          - Premium vitrified flooring
      # ... more rooms
```

## Flat Layout Reference

```
Floor Plan Layout (8 flats per floor):

┌─────────────┬──────────┬─────────────┐
│   Flat 1    │          │   Flat 2    │
│   3 BHK     │ CORRIDOR │   3 BHK     │
│ 2262 sqft   │          │ 1926 sqft   │
│ East facing │          │ West facing │
├─────────────┤          ├─────────────┤
│   Flat 3    │          │   Flat 4    │
│   2 BHK     │ CORRIDOR │   2 BHK     │
│ 1355 sqft   │          │ 1355 sqft   │
│ East facing │          │ West facing │
├─────────────┤          ├─────────────┤
│   Flat 5    │          │   Flat 6    │
│   2 BHK     │ CORRIDOR │   2 BHK     │
│ 1355 sqft   │          │ 1355 sqft   │
│ East facing │          │ West facing │
├─────────────┤          ├─────────────┤
│   Flat 7    │          │   Flat 8    │
│   3 BHK     │ CORRIDOR │   3 BHK     │
│ 2262 sqft   │          │ 1926 sqft   │
│ East facing │          │ West facing │
└─────────────┴──────────┴─────────────┘
```

## Coordinate System

- **Origin**: Top-left corner (0, 0)
- **Units**: Pixels
- **Floor Plan Dimensions**: 1200 x 1600 pixels
- **Corridor**: x: 540-660, y: 0-1600

## Extraction Zones

| Flat | Position      | X   | Y    | Width | Height |
|------|---------------|-----|------|-------|--------|
| 1    | Top-Left      | 0   | 0    | 540   | 400    |
| 2    | Top-Right     | 660 | 0    | 540   | 400    |
| 3    | Mid-Left      | 0   | 400  | 540   | 400    |
| 4    | Mid-Right     | 660 | 400  | 540   | 400    |
| 5    | Lower-Left    | 0   | 800  | 540   | 400    |
| 6    | Lower-Right   | 660 | 800  | 540   | 400    |
| 7    | Bottom-Left   | 0   | 1200 | 540   | 400    |
| 8    | Bottom-Right  | 660 | 1200 | 540   | 400    |

## Integration with Digital Twin

The extracted images and metadata can be directly used in the digital twin application:

```python
# Load flat metadata
import yaml

with open('extracted_plans/towerA_floor02_metadata.yaml', 'r') as f:
    floor_data = yaml.safe_load(f)

# Access flat information
flat1 = floor_data['flats']['flat1']
print(f"Flat 1: {flat1['bhk']} BHK, {flat1['sqft']} sqft")
print(f"Facing: {flat1['facing']}")
print(f"Image: {flat1['image_file']}")

# Access room details
for room_id, room in flat1['rooms'].items():
    print(f"  {room['name']}: {room['dimensions']}, {room['direction']}")
```

## Troubleshooting

**Issue**: `pdf2image` not working
- **Solution**: Install poppler (see Installation section)

**Issue**: Images not extracting correctly
- **Solution**: Check that input image dimensions match configuration (1200x1600)

**Issue**: Wrong flat positions
- **Solution**: Verify coordinate system matches your PDF layout

## Advanced Usage

### Custom Configuration

Create a custom configuration file with different coordinates:

```yaml
metadata:
  extraction_zones:
    flat1: { x: 0, y: 0, width: 600, height: 450 }
    # ... customize as needed
```

Then use it:

```bash
python extract_floor_plans.py \
    --config custom-layout.yaml \
    --single-page floor_plan.png \
    --output-dir output/
```

### Batch Processing Script

```bash
#!/bin/bash
# Process all towers and floors

for tower in A B C D E F G H I J K L; do
    for floor in {1..40}; do
        python extract_floor_plans.py \
            --single-page "plans/tower${tower}_floor${floor}.png" \
            --tower $tower \
            --floor $floor \
            --output-dir extracted_plans/
    done
done
```

## Output Structure

```
extracted_plans/
├── towerA_floor01_flat1.png
├── towerA_floor01_flat2.png
├── ...
├── towerA_floor01_metadata.yaml
├── towerA_floor02_flat1.png
├── ...
└── towerL_floor40_metadata.yaml
```

## Next Steps

1. Extract floor plans from PDF page 28 onwards
2. Verify extraction accuracy
3. Import metadata into digital twin backend
4. Update frontend to display extracted floor plan images
5. Add interactive room highlighting based on coordinates
