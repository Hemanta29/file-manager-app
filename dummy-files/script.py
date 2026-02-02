import os
import random
import string

def random_string(length=10):
    """Generate a random string of fixed length."""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))

def random_data(size=1024):
    """Generate random binary data of fixed size."""
    letters = string.ascii_lowercase + string.digits + string.ascii_uppercase
    return ''.join(random.choice(letters) for _ in range(size)).encode('utf-8')

def generate_files_in_folder(folder_path, num_files=10):
    """Generate random files in the specified folder."""
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    for _ in range(num_files):
        file_name = random_string() + '.txt'
        file_path = os.path.join(folder_path, file_name)
        with open(file_path, 'wb') as f:
            f.write(random_data())
    print(f"Generated {num_files} files in {folder_path}")
    
    
if __name__ == "__main__":
    script_dir = os.path.dirname(__file__)
    generate_files_in_folder(os.path.join(script_dir, 'random-files'), num_files=40)