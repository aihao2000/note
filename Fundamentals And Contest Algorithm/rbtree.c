#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define RED 0
#define BLACK 1

typedef struct Node {
    char key[MAX_WORD_LENGTH];
    int val;
    int color;
    struct Node* left;
    struct Node* right;
    struct Node* parent;
} Node;

Node* root = NULL;

Node* createNode(char key[], int val) {
    Node* node = (Node*)malloc(sizeof(Node));
    strcpy(node->key, key);
    node->val = val;
    node->color = RED;
    node->left = NULL;
    node->right = NULL;
    node->parent = NULL;
    return node;
}

void rotateLeft(Node* node) {
    Node* right = node->right;
    node->right = right->left;
    if (right->left != NULL) {
        right->left->parent = node;
    }
    right->parent = node->parent;
    if (node->parent == NULL) {
        root = right;
    } else if (node == node->parent->left) {
        node->parent->left = right;
    } else {
        node->parent->right = right;
    }
    right->left = node;
    node->parent = right;
}

void rotateRight(Node* node) {
    Node* left = node->left;
    node->left = left->right;
    if (left->right != NULL) {
        left->right->parent = node;
    }
    left->parent = node->parent;
    if (node->parent == NULL) {
        root = left;
    } else if (node == node->parent->right) {
        node->parent->right = left;
    } else {
        node->parent->left = left;
    }
    left->right = node;
    node->parent = left;
}

void fixup(Node* node) {
    while (node != root && node->parent->color == RED) {
        if (node->parent == node->parent->parent->left) {
            Node* uncle = node->parent->parent->right;
            if (uncle != NULL && uncle->color == RED) {
                node->parent->color = BLACK;
                uncle->color = BLACK;
                node->parent->parent->color = RED;
                node = node->parent->parent;
            } else {
                if (node == node->parent->right) {
                    node = node->parent;
                    rotateLeft(node);
                }
                node->parent->color = BLACK;
                node->parent->parent->color = RED;
                rotateRight(node->parent->parent);
            }
        } else {
            Node* uncle = node->parent->parent->left;
            if (uncle != NULL && uncle->color == RED) {
                node->parent->color = BLACK;
                uncle->color = BLACK;
                node->parent->parent->color = RED;
                node = node->parent->parent;
            } else {
                if (node == node->parent->left) {
                    node = node->parent;
                    rotateRight(node);
                }
                node->parent->color = BLACK;
                node->parent->parent->color = RED;
                rotateLeft(node->parent->parent);
            }
        }
    }
    root->color = BLACK;
}

void insert(char key[], int val) {
    Node* node = createNode(key, val);
    Node* current = root;
    Node* parent = NULL;
    while (current != NULL) {
        parent = current;
        int cmp = strcmp(node->key, current->key);
        if (cmp < 0) {
            current = current->left;
        } else if (cmp > 0) {
            current = current->right;
        } else {
            current->val = node->val;
            free(node);
            return;
        }
    }
    node->parent = parent;
    if (parent == NULL) {
        root = node;
    } else if (strcmp(node->key, parent->key) < 0) {
        parent->left = node;
    } else {
        parent->right = node;
    }
    fixup(node);
}

Node* search(char key[]) {
    Node* current = root;
    while (current != NULL) {
        int cmp = strcmp(key, current->key);
        if (cmp < 0) {
            current = current->left;
        } else if (cmp > 0) {
            current = current->right;
        } else {
            return current;
        }
    }
    return NULL;
}

void transplant(Node* u, Node* v) {
    if (u->parent == NULL) {
        root = v;
    } else if (u == u->parent->left) {
        u->parent->left = v;
    } else {
        u->parent->right = v;
    }
    if (v != NULL) {
        v->parent = u->parent;
    }
}

Node* minimum(Node* node) {
    while (node->left != NULL) {
        node = node->left;
    }
    return node;
}

void deleteFixup(Node* node) {
    while (node != root && node->color == BLACK) {
        if (node == node->parent->left) {
            Node* sibling = node->parent->right;
            if (sibling->color == RED) {
                sibling->color = BLACK;
                node->parent->color = RED;
                rotateLeft(node->parent);
                sibling = node->parent->right;
            }
            if (sibling->left->color == BLACK && sibling->right->color == BLACK) {
                sibling->color = RED;
                node = node->parent;
            } else {
                if (sibling->right->color == BLACK) {
                    sibling->left->color = BLACK;
                    sibling->color = RED;
                    rotateRight(sibling);
                    sibling = node->parent->right;
                }
                sibling->color = node->parent->color;
                node->parent->color = BLACK;
                sibling->right->color = BLACK;
                rotateLeft(node->parent);
                node = root;
            }
        } else {
            Node* sibling = node->parent->left;
            if (sibling->color == RED) {
                sibling->color = BLACK;
                node->parent->color = RED;
                rotateRight(node->parent);
                sibling = node->parent->left;
            }
            if (sibling->right->color == BLACK && sibling->left->color == BLACK) {
                sibling->color = RED;
                node = node->parent;
            } else {
                if (sibling->left->color == BLACK) {
                    sibling->right->color = BLACK;
                    sibling->color = RED;
                    rotateLeft(sibling);
                    sibling = node->parent->left;
                }
                sibling->color = node->parent->color;
                node->parent->color = BLACK;
                sibling->left->color = BLACK;
                rotateRight(node->parent);
                node = root;
            }
        }
    }
    node->color = BLACK;
}

void deleteNode(Node* node) {
    Node* x;
    Node* y = node;
    int y_original_color = y->color;
    if (node->left == NULL) {
        x = node->right;
        transplant(node, node->right);
    } else if (node->right == NULL) {
        x = node->left;
        transplant(node, node->left);
    } else {
        y = minimum(node->right);
        y_original_color = y->color;
        x = y->right;
        if (y->parent == node) {
            x->parent = y;
        } else {
            transplant(y, y->right);
            y->right = node->right;
            y->right->parent = y;
        }
        transplant(node, y);
        y->left = node->left;
        y->left->parent = y;
        y->color = node->color;
    }
    if (y_original_color == BLACK) {
        deleteFixup(x);
    }
    free(node);
}

void inorderTraversal(Node* node) {
    if (node != NULL) {
        inorderTraversal(node->left);
        printf("%s: %d\n", node->key, node->val);
        inorderTraversal(node->right);
    }
}