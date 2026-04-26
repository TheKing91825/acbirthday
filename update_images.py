import os
import re

base_dir = '/Users/abhaychauhan/Library/CloudStorage/OneDrive-GeorgiaInstituteofTechnology/ACbirthday/acbirthday'

def replace_placeholder(content, label_text, img_src):
    pattern = r'<div class="photo-placeholder([^>]*)">\s*<span class="icon">📷</span>\s*<span class="label">' + re.escape(label_text) + r'</span>\s*</div>'
    # Keep whatever attributes were on the original div in \1
    replacement = r'<div class="photo-placeholder\1 style="padding: 0; border: none; background: transparent;">\n      <img src="' + img_src + r'" alt="' + label_text + r'" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">\n    </div>'
    # The previous regex captured everything after 'photo-placeholder' up to the closing quote.
    # Now it captures everything up to the >.
    # We need to make sure we don't duplicate attributes. Let's just do a simpler replacement for the innerHTML of those divs.
    
    # Actually, a better approach is to find the exact span with the label, and replace its parent div's innerHTML
    return content

def replace_placeholder_better(content, label_text, img_src):
    # Match the entire div opening tag, then the contents, then the closing div
    # using re.sub with a function or just a broader regex.
    # (<div[^>]*class="[^"]*photo-placeholder[^"]*"[^>]*>)\s*<span class="icon">📷</span>\s*<span class="label">LABEL</span>\s*</div>
    pattern = r'(<div[^>]*class="[^"]*photo-placeholder[^"]*"[^>]*>)\s*<span class="icon">📷</span>\s*<span class="label">' + re.escape(label_text) + r'</span>\s*</div>'
    
    # We also need to inject padding:0; border:none into the div's style if it has one, or add it.
    # To keep it simple, we can just replace the inner contents with an img that covers everything, and override the padding using a nested div or CSS.
    # Let's just put the img. The padding of the parent won't matter if we use absolute positioning, or we can just replace the whole div.
    
    def repl(m):
        div_start = m.group(1)
        # If there's an existing style, append to it. Else add style.
        if 'style="' in div_start:
            div_start = div_start.replace('style="', 'style="padding: 0; border: none; background: transparent; ')
        else:
            div_start = div_start.replace('>', ' style="padding: 0; border: none; background: transparent;">')
            
        return f'{div_start}\n      <img src="{img_src}" alt="{label_text}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">\n    </div>'
        
    return re.sub(pattern, repl, content)

# Process all files again
files = ['index.html', 'ajit.html', 'alka.html', 'abhay.html', 'akshay.html', 'ajit-51.html']

replacements = [
    ('index.html', 'Family Photo', 'assets/images/family/Family.JPG'),
    ('index.html', 'Ajit', 'assets/images/ajit/IMG_3958.JPG'),
    ('index.html', 'Alka', 'assets/images/alka/DSCN17651.jpg'),
    ('index.html', 'Abhay', 'assets/images/abhay/IMG_5289.JPG'),
    ('index.html', 'Akshay', 'assets/images/akshay/IMG_0054.JPG'),

    ('ajit.html', "Ajit's Photo", 'assets/images/ajit/20110122_37.JPG'),
    ('ajit.html', 'Photo 1', 'assets/images/ajit/IMG_4367.JPG'),
    ('ajit.html', 'Photo 2', 'assets/images/ajit/Photo566772379024_inner_23-91-949-47-31-703-934-677.jpg'),
    ('ajit.html', 'Photo 3', 'assets/images/ajit/IMG_4147.HEIC'),
    ('ajit.html', 'Photo 4', 'assets/images/ajit/IMG_3552.HEIC'),
    ('ajit.html', 'Photo 5', 'assets/images/ajit/IMG_1305.HEIC'),
    ('ajit.html', 'Photo 6', 'assets/images/ajit/IMG_0081.HEIC'),

    ('alka.html', "Alka's Photo", 'assets/images/alka/4.16.2023 3820_edited_Original Copy.JPG'),
    ('alka.html', 'Photo 1', 'assets/images/alka/IMG_0123 Copy.JPG'),
    ('alka.html', 'Photo 2', 'assets/images/alka/IMG_2494.HEIC'),
    ('alka.html', 'Photo 3', 'assets/images/alka/IMG_7013.HEIC'),
    ('alka.html', 'Photo 4', 'assets/images/alka/IMG_0559.HEIC'),
    ('alka.html', 'Photo 5', 'assets/images/alka/IMG_5666.HEIC'),
    ('alka.html', 'Photo 6', 'assets/images/alka/IMG_3435.HEIC'),

    ('abhay.html', "Abhay's Photo", 'assets/images/abhay/IMG_8552.JPG'),
    ('abhay.html', 'Photo 1', 'assets/images/abhay/IMG_0601.HEIC'),
    ('abhay.html', 'Photo 2', 'assets/images/abhay/IMG_4203.HEIC'),
    ('abhay.html', 'Photo 3', 'assets/images/abhay/IMG_5539-1.jpg'),

    ('akshay.html', "Akshay's Photo", 'assets/images/akshay/IMG_2525.JPG'),
    ('akshay.html', 'Photo 1', 'assets/images/akshay/IMG_4508.JPG'),
    ('akshay.html', 'Photo 2', 'assets/images/akshay/IMG_0032.JPG'),
    ('akshay.html', 'Photo 3', 'assets/images/akshay/IMG_0024.JPG'),
    ('akshay.html', 'Photo 4', 'assets/images/akshay/IMG_4726.JPG'),
    ('akshay.html', 'Photo 5', 'assets/images/akshay/IMG_2800.HEIC'),
    ('akshay.html', 'Photo 6', 'assets/images/akshay/IMG_6012.HEIC'),

    ('ajit-51.html', "Ajit's Birthday Photo — Main", 'assets/images/ajit/IMG_4308.HEIC'),
    ('ajit-51.html', 'Memory 1', 'assets/images/ajit/IMG_4456.HEIC'),
    ('ajit-51.html', 'Memory 2', 'assets/images/ajit/IMG_5752.HEIC')
]

for filename in files:
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    for req_file, label, img in replacements:
        if req_file == filename:
            content = replace_placeholder_better(content, label, img)
            
    with open(filepath, 'w') as f:
        f.write(content)

print("HTML files updated with images successfully.")
