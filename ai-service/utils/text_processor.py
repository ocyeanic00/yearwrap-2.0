def process_memories(memories):
    """Process memories and generate recap content"""
    
    if not memories:
        return {
            'summary': 'No memories to process',
            'highlights': []
        }
    
    # Extract key themes
    all_lessons = [m.get('notes', {}).get('lesson', '') for m in memories if m.get('notes', {}).get('lesson')]
    all_people = [m.get('notes', {}).get('people', '') for m in memories if m.get('notes', {}).get('people')]
    all_places = [m.get('notes', {}).get('place', '') for m in memories if m.get('notes', {}).get('place')]
    
    recap = {
        'summary': f'You captured {len(memories)} memories this year',
        'highlights': {
            'lessons': all_lessons[:3],
            'people': list(set(all_people))[:5],
            'places': list(set(all_places))[:5]
        },
        'total_memories': len(memories)
    }
    
    return recap
